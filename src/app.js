const ex = require("express");
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = ex();

app.get("/", (req, res) => {
        res.send("Olá, Mundo!");
    });

// configura para interpretar solicitações com dados codificados no formato URL
app.use(ex.urlencoded({ extended: true }))

// configura o aplicativo para servir arquivos estáticos que estão na pasta public
app.use(ex.static(__dirname + './public'));

//rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const port = 8080

app.listen(port, () => {
    console.log('Servidor rodando na porta 8080');
  });

