const express = require("express");
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const messagesModel = require('./database/models/messages.model');
const viewRouter = require('./routes/view.router');

const handlebars = require('express-handlebars');  
const  {Server} = require('socket.io')

const mongoose = require('mongoose');
const http = require('http');
const path = require("path");
const  validateProductBody  = require('./middleware/products.middleware');
const port = 8080
const app = express();
const server = http.createServer(app)
const socketServer = new Server(server)
const session = require('express-session');



// configura para interpretar solicitações com dados codificados no formato URL
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'sua-chave-secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname, '/views'));

// configura o aplicativo para servir arquivos estáticos que estão na pasta public
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

app.use((req, res, next) => {
    req.app.socketServer = socketServer; // Passa o objeto io para as rotas
    next();
});

// rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/view', viewRouter);

mongoose.connect('mongodb+srv://dev-anjos:coder@cluster0.ruzk8.mongodb.net/ecommerce')
    .then(() =>{
        console.log('Conectado ao banco de dados')
    }).catch((error) => {
        console.log(error)
    })

socketServer.on('connection', socket => {
    console.log('Usuário conectado');

    socket.on('newProduct' , (newProduct) => {
                    
        // const productsUpdated = data;

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
    console.log(`Servidor escutando na porta ${port}`);
});



