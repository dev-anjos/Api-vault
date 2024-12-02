const express = require("express");
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const handlebars = require('express-handlebars');  
const  {Server} = require('socket.io') 

const http = require('http');
const path = require("path");
// const { default: mongoose } = require("mongoose");
const  validateProductBody  = require('./middleware/products.middleware');
const port = 8080
const app = express();
const server = http.createServer(app)
const socketServer = new Server(server)

// configura para interpretar solicitações com dados codificados no formato URL
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine('handlebars', handlebars.engine());
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

// mongoose.connect('mongodb+srv://dev-anjos:coder@cluster0.ruzk8.mongodb.net/usersdb')
//     .then(() =>{
//         console.log('Conectado a la base de datos')
//     }).catch((error) => {
//         console.log(error)
//     })

socketServer.on('connection', socket => {
    console.log('Usuário conectado');


    socket.on('newProduct' , (newProduct) => {
                    
        const productsUpdated = data;

        socketServer.emit('refreshProducts', newProduct);
    })

    
});

server.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});



