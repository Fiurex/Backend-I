const express = require("express");
const CartManager = require("../dao/CartManager");

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    const cart = await cartManager.createCart();
    res.json(cart);
});

router.get("/:cid", (req, res) => {
    const cart = cartManager.getCartById(parseInt(req.params.cid));
    cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        // Extraer los parámetros y validarlos
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).json({ error: "El carrito y el producto deben ser validos" });
        }

        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        let { quantity } = req.body;
        if (quantity !== undefined) {
            quantity = parseInt(quantity);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: "La cantidad debe ser un numero mayor a 0" });
            }
        } else {
            quantity = 1;
        }

        
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
