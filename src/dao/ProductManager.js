const fs = require("fs");
const path = "./src/data/products.json";

class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, "utf-8");
                this.products = JSON.parse(data);
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    async saveProducts() {
        await fs.promises.writeFile(path, JSON.stringify(this.products, null, 2));
    }

    getAll() {
        return this.products;
    }

    getById(id) {
        return this.products.find((p) => p.id === id);
    }

    async addProduct(product) {
        product.id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
        this.products.push(product);
        await this.saveProducts();
        return product;
    }

    async updateProduct(id, newData) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) return null;

        this.products[index] = { ...this.products[index], ...newData };
        await this.saveProducts();
        return this.products[index];
    }

    async deleteProduct(id) {
        const aux=this.products.filter((p) => p.id !== id)
        this.products = this.products.filter((p) => String(p.id) !== String(id));
        await this.saveProducts();
        
    }
}
module.exports = ProductManager;
