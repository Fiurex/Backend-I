const mongoose = require("mongoose");
const productosModelo = require("./models/productosModelo.js");

class ProductManagerMongoo {
  constructor() {
    this.model = productosModelo;
  }

  // Obtener todos los productos o uno específico por ID
  async get(id) {
    return id ? this.model.findById(id).lean() : this.model.find().lean();
  }

  // Agregar nuevo producto
  async addProduct(product) {
    const newProduct = new this.model(product);
    return await newProduct.save();
  }

  // Actualizar producto por ID
  async update(id, newData) {
    return await this.model.findByIdAndUpdate(id, newData, { new: true });
  }

  // Eliminar producto por ID
  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Obtiene productos paginados, filtrados y ordenados.
   * @param {Object} options - Opciones para la paginación y filtros.
   * @param {number} options.limit - Número de productos por página.
   * @param {number} options.page - Página actual.
   * @param {string} options.sort - "asc" o "desc" por precio.
   * @param {string} options.query - Categoría o "disponibles" (stock > 0).
   * @param {string} options.baseUrl - URL base para generar links de navegación.
   * @returns {Object} - Resultado con paginación, links y productos.
   */
  async getPaginatedProducts({ limit = 10, page = 1, sort, query, baseUrl = "/api/products" }) {
    try {
      const filter = {};

      // Filtro por categoría o por disponibilidad
      if (query) {
        if (query === "disponibles") {
          filter.stock = { $gt: 0 };
        } else {
          filter.category = query;
        }
      }

      // Ordenamiento por precio
      const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

      const skip = (page - 1) * limit;
      const products = await this.model.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await this.model.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null;
      const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null;

      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      };
    } catch (error) {
      console.error("Error al obtener productos paginados:", error);
      return {
        status: "error",
        message: "Error al obtener productos paginados"
      };
    }
  }
}

module.exports = ProductManagerMongoo;
