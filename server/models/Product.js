import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  features: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
