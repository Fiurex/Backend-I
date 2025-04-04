const Cart = require('./models/cartModelo');
const ProductModel = require('./models/productosModelo');

class CartManagerMongoo {
  constructor() {
    this.model = Cart;
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  async getAllCarts() {
    try {
      const carts = await this.model.find().populate('products.product').lean();
      return carts;
    } catch (error) {
      console.error("Error al obtener todos los carritos:", error);
      throw new Error("No se pudieron obtener los carritos");
    }
  }

  async getCartById(cid) {
    if (!cid) throw new Error("ID del carrito requerido");
    const cart = await this.model.findById(cid).populate("products.product");
    return cart;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    if (quantity <= 0) throw new Error("La cantidad debe ser mayor que cero");

    const cart = await this.model.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await ProductModel.findById(pid);
    if (!product) throw new Error("Producto no encontrado");

    const productInCart = cart.products.find(p => p.product.equals(pid));
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return await cart.populate("products.product");
  }

  
  async removeProductFromCart(cid, pid) {
    const cart = await this.model.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();
    return await cart.populate("products.product");
  }

  async updateAllProducts(cid, newProducts) {
    const cart = await this.model.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = newProducts.map(p => ({
      product: p.product,
      quantity: p.quantity > 0 ? p.quantity : 1
    }));

    await cart.save();
    return await cart.populate("products.product");
  }

  async updateProductQuantity(cid, pid, quantity) {
    if (quantity <= 0) throw new Error("Cantidad inválida");

    const cart = await this.model.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productInCart = cart.products.find(p => p.product.equals(pid));
    if (!productInCart) throw new Error("Producto no encontrado en el carrito");

    productInCart.quantity = quantity;
    await cart.save();
    return await cart.populate("products.product");
  }

  async deleteAllProducts(cid) {
    const cart = await this.model.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return await cart.populate("products.product");
  }
}

module.exports = CartManagerMongoo;


