const express = require('express');
const Router = require('express').Router;
const ProductManagerMongoo = require('../dao/ProductManagerMongoo');
const CartManagerMongoo = require('../dao/CartManagerMongoo');

const router = Router();

const productManager = new ProductManagerMongoo();
const cartManager = new CartManagerMongoo();

// Vista principal con productos paginados
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "asc", query = "" } = req.query;

    const result = await productManager.getPaginatedProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.render('home', {
      products: result.payload, 
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit
    });
  } catch (error) {
    console.error('Error al renderizar productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.get(pid);

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    const cartId = '64ec17d2426b5f2b8fda8392'; // <- reemplaza con tu lógica o ID real

    res.render('productDetail', { product, cartId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lista carritos disponibles
router.get('/carts', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render('carts', { carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vista renderizada de un carrito específico usando Handlebars
router.get('/carts/view/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) return res.status(404).send(' Carrito no encontrado');

    

    
    const validProducts = cart.products.filter(p => p.product);
    cart.products = validProducts;

    res.render('cart', { cart: cart.toObject(), cid: cart._id });
  } catch (error) {
    console.error("⚠️ Error en ruta /carts/view/:cid:", error);
    res.status(500).json({ error: error.message });
  }
});


// Agregar producto al carrito (redireccionando a la vista)
router.post('/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let { quantity = 1 } = req.body;
    quantity = parseInt(quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).send('Cantidad inválida');
    }

    await cartManager.addProductToCart(cid, pid, quantity);
    res.redirect(`/carts/view/${cid}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
