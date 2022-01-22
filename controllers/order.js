import orderModel from '../models/order.js';
import errorHandler from '../helpers/dbErrorHandler.js';

const create = (req, res) => {
    console.log('CREATE ORDER: ', req.body);
    req.body.order.user = req.profile;
    const order = orderModel.Order(req.body.order);
    order.save((error, data)=> {
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            })
        }else{
            res.json(data);
        }
    })
}

const listOrders = (req, res)=> {
    orderModel.Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((error, orders)=> {
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        res.json(orders)
    })
}

const getStatusValues = (req, res)=> {
    res.json(orderModel.Order.schema.path('status').enumValues);
}

const orderById = (req, res, next, id)=> {
    orderModel.Order.findById(id)
    .populate('products.product', 'name price')
    .exec((error, order)=> {
        if(error || !order){
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
        req.order = order;
        next();
    })
}

const updateOrderStatus = (req, res)=> {
    orderModel.Order
    .updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};

export default {create, listOrders, getStatusValues, orderById, updateOrderStatus};