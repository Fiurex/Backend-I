const fs = require("fs");
const path = "./src/data/cart.json";

class CartManager {
    constructor() {
        this.carts = [];
        this.loadCart();
    }

    async loadCart() {
        try {
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, "utf-8");
                this.carts = JSON.parse(data);
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        }
    }

    async saveCart() {
        await fs.promises.writeFile(path, JSON.stringify(this.carts, null, 2));
    }

    // Crear un nuevo carrito
    async createCart() {
        const newCart = { id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1, products: [] };
        this.carts.push(newCart);
        await this.saveCart();
        return newCart;
    }

    // carrito por ID
    getCartById(id) {
        return this.carts.find((cart) => cart.id === id);
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex((p) => p.product === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveCart();
        return cart;
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter((p) => p.product !== productId);
        await this.saveCart();
        return cart;
    }

    // Actualizar todos los productos del carrito
    async updateCart(cartId, products) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        if (!Array.isArray(products)) {
            throw new Error("El formato de productos es inválido");
        }

        cart.products = products;
        await this.saveCart();
        return cart;
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex((p) => p.product === productId);
        if (productIndex === -1) return null;

        cart.products[productIndex].quantity = quantity;
        await this.saveCart();
        return cart;
    }

    // Vaciar un carrito
    async emptyCart(cartId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        cart.products = [];
        await this.saveCart();
        return cart;
    }

    // Obtener carrito con detalles completos de los productos (Simulación de "populate")
    async getCartWithProducts(cartId, productManager) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const populatedCart = {
            ...cart,
            products: await Promise.all(
                cart.products.map(async (p) => {
                    const productDetails = await productManager.getProductById(p.product);
                    return {
                        product: productDetails || { error: "Producto no encontrado" },
                        quantity: p.quantity,
                    };
                })
            ),
        };

        return populatedCart;
    }
}

module.exports = CartManager;
