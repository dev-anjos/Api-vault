const express = require("express");
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const messagesModel = require('./database/models/messages.model');
const viewRouter = require('./routes/view.router');
const userRouter = require('./routes/user.router');
const sessionRouter = require('./routes/session.router');

const handlebars = require('express-handlebars');
const handlebarsHelpers = require('handlebars');
const {Server} = require('socket.io')
const mongoose = require('mongoose');
const http = require('http');
const path = require("path");
const app = express();
const server = http.createServer(app)
const socketServer = new Server(server)
const session = require('express-session');
const cookieParser = require('cookie-parser');
const initializePassport = require('./config/passportStrategy');
const local = require('passport-local');
const MongoStore = require('connect-mongo');
const moment = require('moment');
const passport = require("passport");
const port = 8080

const staticPath = path.join(__dirname, "Public");
require('dotenv').config();

handlebarsHelpers.registerHelper('moment', function(date, format) {
    return moment(date).format(format);
});

// configura para interpretar solicitações com dados codificados no formato URL
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname, '/views'));

// configura o aplicativo para servir arquivos estáticos que estão na pasta public
app.use(express.static(staticPath));
app.use((req, res, next) => {
    req.app.socketServer = socketServer;
    next();
});
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://dev-anjos:${process.env.MONGODB_PASSWORD}@cluster0.ruzk8.mongodb.net/ecommerce`,
            ttl: 600,
        }),
        secret:  process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(session({
    store:MongoStore.create({
        mongoUrl: `mongodb+srv://dev-anjos:${process.env.MONGODB_PASSWORD}@cluster0.ruzk8.mongodb.net/ecommerce`,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

mongoose.connect(`mongodb+srv://dev-anjos:${process.env.MONGODB_PASSWORD }@cluster0.ruzk8.mongodb.net/ecommerce`)
    .then(() =>{
        console.log('Conectado ao banco de dados')
    }).catch((error) => {
    console.log(error)
})

initializePassport();
app.use(passport.session());
app.use(passport.initialize());

// rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/view', viewRouter);
app.use('/api/user', userRouter );
app.use('/api/session', sessionRouter);

socketServer.on('connection', socket => {
    console.log('Usuário conectado');

    socket.on('newProduct' , (newProduct) => {
        socketServer.emit('refreshProducts', newProduct);
    })

     socket.on('chat message', async (user, msg) => {
         console.log(user,msg)
         await messagesModel.create({
             user: user,
             message: msg
         });
        socketServer.emit('chat message',  `${user}: ${msg}`);
    });

    socket.on("updateCart", (newCart) => {
        console.log("Carrinho atualizado:", newCart);
        socketServer.emit("refreshCart", newCart);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/api/view`);
});



