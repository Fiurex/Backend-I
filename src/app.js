const express = require("express");
const {engine} =require("express-handlebars")
const productRouter = require("./routes/products.routes");
const cartRouter = require ("./routes/carts.routes")
const viewsRouter=require("./routes/viewsRouter.js")
const ProductManager=require("./dao/ProductManager.js")
const {Server} =require("socket.io")
const PORT = 8080;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

 
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")




app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter)


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

const serverHttp=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io=new Server(serverHttp);

const productManager = new ProductManager();

let productosActualizados=[];

io.on('connection', (socket)=>{
    let productos=productManager.getAll();
    
    socket.on('newProduct', newProduct =>{
        productManager.addProduct(newProduct);
        let productos=productManager.getAll();
        console.log("Se recibio un producto nuevo");  
        io.emit('productos', productos)
        
    })

    socket.on('deleteProduct' , deleteProduct =>{
        productManager.deleteProduct(deleteProduct);
        let productos=productManager.getAll();
        console.log("Producto Eliminado");
        io.emit('productos', productos)
    })

    socket.emit('productos' , productos);
    console.log("se enviaron los productos")

   

       
})
