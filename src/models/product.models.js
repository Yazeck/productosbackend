import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
price: {
    type: Number,
    default: 0.0,
    required: true
},
quantity: {
    type: Number,
    default: 0,
    required: true
}
});

export default mongoose.model('Product',productSchema);