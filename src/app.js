const express = require('express');
const { engine } = require('express-handlebars');
const config = require('./config/config.js');
const { conectarDB } = require('./connDB.js');
const productRouter = require('./routes/products.routes');
const cartRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/viewsRouter.js');
const ProductManager = require('./dao/ProductManager.js');
const { Server } = require('socket.io');
const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas de API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Formato JSON inválido' });
    }
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
});

// Configuración del servidor HTTP
const serverHttp = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(serverHttp);

// Inicializar ProductManager
const productManager = new ProductManager();

// Manejo de WebSocket (Socket.IO)
io.on('connection', (socket) => {
    let productos = productManager.getAll();

    // Escuchar evento de nuevo producto
    socket.on('newProduct', (newProduct) => {
        productManager.addProduct(newProduct);
        productos = productManager.getAll();
        console.log('Se recibió un producto nuevo');
        io.emit('productos', productos);
    });

    // Escuchar evento de eliminar producto
    socket.on('deleteProduct', (deleteProduct) => {
        productManager.deleteProduct(deleteProduct);
        productos = productManager.getAll();
        console.log('Producto Eliminado');
        io.emit('productos', productos);
    });

    // Enviar lista de productos al cliente
    socket.emit('productos', productos);
    console.log('Se enviaron los productos');
});

// Conectar a la base de datos
conectarDB(config.MONGO_URL, config.DB_NAME);
