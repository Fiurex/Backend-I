const fs = require("fs");
const path = "./src/data/carts.json";

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

    async createCart() {
        const newCart = { id: this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1, products: [] };
        this.carts.push(newCart);
        await this.saveCart();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find((cart) => cart.id === id);
    }

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
}

module.exports = CartManager;
