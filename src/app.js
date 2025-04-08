import express from "express";
import handlebars from "express-handlebars";
import handlebarsHelpers from "handlebars";
import mongoose from "mongoose";
import http from "http";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passportStrategy.js";
import local from "passport-local";
import MongoStore from "connect-mongo";
import moment from "moment";
import passport from "passport";
import {config} from "dotenv";
import productsRouter from './routes/products.router.js';
import cartsRouter  from './routes/carts.router.js';
import messagesModel  from './database/models/messages.model.js';
import viewRouter  from './routes/view.router.js';
import userRouter  from './routes/user.router.js';
import sessionRouter  from './routes/session.router.js';
import {Server}  from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticPath = path.join(__dirname, "Public");

const app = express();
const server = http.createServer(app)
const socketServer = new Server(server)
const port = 8080

config();

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



