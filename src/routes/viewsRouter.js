const ProductManager = require("../dao/ProductManager"); 
const Router = require('express').Router;
const router = Router();

const productManager = new ProductManager();

router.get('/products', async (req, res) => {
    try {
        let productos = await productManager.getAll();

        if (productos.length === 0) {
            return res.render('producto', { 
                title: "Sin productos",
                price: "N/A"
            });
        }

        

        res.render('home', { 
            productos:productos
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
