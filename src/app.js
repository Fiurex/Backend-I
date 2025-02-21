const express = require("express");
const { ProductManager } = require("./dao/ProductManager");
const { CartManager } = require("./dao/CartManager")
const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.get("/", (req, res) => {
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
});

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
