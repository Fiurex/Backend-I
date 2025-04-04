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
        this.products = JSON.parse(await fs.promises.readFile(path, "utf-8"));
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      this.products = [];
    }
  }

  async saveProducts() {
    try {
      await fs.promises.writeFile(path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error al guardar productos:", error);
    }
  }

  /**
   * Obtiene todos los productos o uno específico si se pasa un ID.
   * @param {number} [id] - ID del producto (opcional).
   * @returns {Array|Object|null} - Todos los productos, un producto o null si no existe.
   */
  get(id) {
    return id ? this.products.find((p) => p.id === parseInt(id)) || null : this.products;
  }

  async addProduct(product) {
    product.id = (this.products[this.products.length - 1]?.id || 0) + 1;
    this.products.push(product);
    await this.saveProducts();
    return product;
  }

  async updateProduct(id, newData) {
    const index = this.products.findIndex((p) => p.id === parseInt(id));
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...newData };
    await this.saveProducts();
    return this.products[index];
  }

  async deleteProduct(id) {
    const beforeLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== parseInt(id));
    if (this.products.length === beforeLength) return null;

    await this.saveProducts();
    return { message: "Producto eliminado correctamente" };
  }

  /**
   * Obtiene productos paginados, filtrados y ordenados.
   * @param {Object} options - Opciones de paginación, filtrado y ordenación.
   * @param {number} options.limit - Número de productos por página.
   * @param {number} options.page - Número de página.
   * @param {number} options.sort - Orden (1 ascendente, -1 descendente).
   * @param {Object} options.query - Filtros de productos (por ejemplo, por categoría o nombre).
   * @returns {Object} - Lista de productos paginados con metadata.
   */
  async getPaginatedProducts({ limit = 10, page = 1, sort = 1, query = {} }) {
    try {
      const skip = (page - 1) * limit; // Saltar productos según la página
      const filteredProducts = this.products.filter((product) => {
        return Object.keys(query).every((key) => product[key]?.toString().toLowerCase().includes(query[key].toString().toLowerCase()));
      });

      // Ordenar productos
      const sortedProducts = filteredProducts.sort((a, b) => {
        if (sort === 1) {
          return a.price - b.price; // Orden ascendente por precio
        } else if (sort === -1) {
          return b.price - a.price; // Orden descendente por precio
        }
        return 0;
      });

      // Paginación
      const products = sortedProducts.slice(skip, skip + limit);
      const total = filteredProducts.length;

      return {
        products,
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error('Error al obtener productos paginados: ' + error.message);
    }
  }
}

module.exports = ProductManager;
