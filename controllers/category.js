import Category from '../models/category.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import _ from 'lodash';

const categoryById = (req, res, next, id)=>{
    Category.findById(id).exec((error, category)=>{
        if(error || !category){
            return res.status(400).json({error: 'Category not found'});
        }
        req.category = category;
        next();
    })
};

const create = (req, res)=>{
    const category = new Category(req.body);
    category.save((error, data)=>{
        if(error){
            return res.status(400).json({error: errorHandler(error)});
        }
        res.json({data});
    })
};


const read = (req, res)=>{
    return res.json(req.category);
};

const update = (req, res)=>{
    let category = req.category;
    category.name = req.body.name;

    category.save((error, data)=>{
        if(error){
            return res.status(400).json({error: errorHandler(error)});
        }
        res.json({data});
    })
};

const remove = (req, res)=>{
    const category = req.category;
    category.remove((error, deletedCategory)=>{
        if(error){
            return res.status(400).json({error: errorHandler(error)});
        }
        return res.json({message: 'Category deleted successfully!'});
    })
}

const list = (req, res)=>{
    Category.find().exec((error, data)=>{
        if(error || !list){
            return res.status(400).json({error: errorHandler(err)});
        }
        res.json(data);
    })
}

export default {create, categoryById, read, remove, update, list};