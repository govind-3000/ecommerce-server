import User from '../models/user.js';
import orderModel from '../models/order.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import dotenv from 'dotenv';
dotenv.config();


const userByid = (req, res, next, id)=>{
    User.findById(id).exec((error, user)=>{
        if(error || !user){
            return res.status(400).json({error: 'User not found!'});
        }
        req.profile = user;
        next();
    })
};

const read = (req, res)=>{
    let user = req.profile;
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json(user);
}

const update = (req, res)=>{
    User.findOneAndUpdate(
        {_id: req.profile._id}, 
        {$set : req.body}, 
        {new:true}, 
        (error, updatedUser)=>{
            if(error){
                return res.status(400),json({
                    error: 'Update failed'
                })
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
}

const addOrderToUserHistory = (req, res, next)=> {
    let history=[];

    req.body.order.products.forEach((item)=> {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount,
        })
    })

    User.findOneAndUpdate(
        {_id: req.profile._id}, 
        {$push: {history: history}}, 
        {new:true}, 
        (error, data)=> {
            if(error){
                res.status(400).json({
                    error: 'Could not update user purchase history'
                })
            }
            next();
        });
}

const purchaseHistory = (req, res)=> {
    orderModel.Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders)=> {
        if(err){
            res.status(400).json({
                error: errorHandler(err)
            });
        } else{
            res.json(orders);
        }
    })
}

export default {userByid, read, update, addOrderToUserHistory, purchaseHistory};