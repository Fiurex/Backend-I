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
    const cart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    cart ? res.json(cart) : res.status(404).json({ error: "Carrito o producto no encontrado" });
});

module.exports = router;
