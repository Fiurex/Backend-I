const express = require("express");
const ProductManager = require("../dao/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

router.get("/", (req, res) => {
    res.json(productManager.getAll());
});

router.get("/:pid", (req, res) => {
    const product = productManager.getById(parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
    const product = await productManager.addProduct(req.body);
    res.json(product);
});

router.put("/:pid", async (req, res) => {
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete("/:pid", async (req, res) => {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.json({ message: "Producto eliminado" });
});

module.exports = router;
