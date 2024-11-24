const express = require("express");
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const handlebars = require('express-handlebars');  
const _dirname = require('./utils');
const  {Server} = require('socket.io') 
const viewsRouter = require('./routes/view.router');
const http = require('http');

const port = 8080
const app = express();

// configura para interpretar solicitações com dados codificados no formato URL
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const server = http.createServer(app)
const socketServer = new Server(server)

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', _dirname + '/views');


// configura o aplicativo para servir arquivos estáticos que estão na pasta public
app.use(express.static(_dirname + '/Public'));

//rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/views',viewsRouter);

socketServer.on('connection', socket => {
    console.log('Usuário conectado');
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });

    socket.on('message', data => {
        console.log(data);
        socketServer.emit('message', data);
    });

    socket.emit('event_individual', 'Essa mensagem deve ser recebida pelo socket cliente');
});

server.listen(port, () => {
    console.log(`Servidor escutando na porta ${port}`);
});



