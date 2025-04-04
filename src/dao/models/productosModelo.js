const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  status: Boolean,
  stock: Number
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("productos", productSchema);
module.exports = ProductModel;
