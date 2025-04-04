const express = require("express");
const router = express.Router();
const CartManagerMongoo = require("../dao/CartManagerMongoo");

const cartManager = new CartManagerMongoo();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID con populate
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const qty = quantity && !isNaN(quantity) && quantity > 0 ? quantity : 1;

    const updatedCart = await cartManager.addProductToCart(cid, pid, qty);
    res.status(200).json({ message: "Producto agregado al carrito", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    res.json({ message: "Producto eliminado del carrito", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Reemplazar todos los productos del carrito con un nuevo array
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product, quantity }]
    const updatedCart = await cartManager.updateAllProducts(cid, products);
    res.json({ message: "Productos actualizados", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto específico
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json({ message: "Cantidad actualizada", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.deleteAllProducts(cid);
    res.json({ message: "Todos los productos eliminados del carrito", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;

