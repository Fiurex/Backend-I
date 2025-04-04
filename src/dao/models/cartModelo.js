const mongoose = require("mongoose");

// Definimos el esquema del carrito
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productos", // Debe coincidir con el nombre del modelo de productos
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
});

// Creamos el modelo
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

