import mongoose  from 'mongoose';
import Category from './category.js';
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        required: true,
        maxlength: 2000
    },
    price:{
        type: Number,
        required: true,
        trim: true,
        maxlength: 32

    },
    category:{
        type: ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo:{
        data: Buffer,
        contentType: String
    },

    shipment:{
        required: false,
        type: Boolean,
    }
 },
    {timestamps: true}
);

const Product = mongoose.model('Product', productSchema);
export default Product;