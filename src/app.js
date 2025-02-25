const express = require("express");
const { ProductManager } = require("./dao/ProductManager");
const { CartManager } = require("./dao/CartManager");
const productRouter = require("./routes/products.routes");
const cartRouter = require ("./routes/carts.routes")
const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Formato JSON inválido" });
    }
    next();
});



app.get("/", (req, res) => {
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
});

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
