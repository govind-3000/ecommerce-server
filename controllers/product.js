import Product from '../models/product.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';

const create = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (error, fields, files)=>{
        if(error){
            return res.status(400).json({error: 'Image could not be uploaded!'});
        }
        let product = new Product(fields);

        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image size sholud be less than 1mb'
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((error, result)=>{
            if(error){
                console.log('PHOTO CREATE ERROR: ', error);
                return res.status(400).json({error: errorHandler(error)});
            }
            res.json(result);
        });
  });
};

const productById = (req, res, next, id)=>{
    Product.findById(id)
    .populate('category')
    .exec((error, product)=>{
        if(error || !product){
            return res.json({error: 'Product not found'});
        }
        req.product = product;
        next();
    })
}

const read = (req, res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}

const remove = (req, res)=>{
    let product = req.product;
    product.remove((error, deletedProduct)=>{
        if(error){
            return res.status(400).json({error: errorHandler(error)});
        }
        res.json({
            message: 'Product Deleted succcessfully!'
        })
    }
)}

const update = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (error, fields, files)=>{
        if(error){
            return res.status(400).json({error: 'Image could not be uploaded!'});
        }

        let product = req.product;
        product = _.extend(product, fields);

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image size sholud be less than 1mb'
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((error, result)=>{
            if(error){
                console.log('PHOTO UPDATE ERROR: ', error);
                return res.status(400).json({error: errorHandler(error)});
            }
            res.json(result);
        });
  });
};

// /products?sortBy=sold&order=asc&limit=4
// /products?sortBy=createdAt&order=asc&limit=4
const list = (req, res)=>{
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((error, products)=>{
        if(error || !products){
            return res.json({
                error: 'Products not found'
            });
        }
        res.json(products);
    });
}

const listRelated = (req, res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((error, products)=>{
        if(error){
            return res.status(400).json({
                error: 'Products not found'
            });
        }
        res.json(products);
    })
}

const listCategories = (req, res)=>{
    Product.distinct('category', {}, (error, categories)=>{
        if(error || !categories){
            return res.json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    })
}
/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
const listBySearch = (req, res)=>{
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for(let key in req.body.filters){
        if(req.body.filters[key].length > 0){
            if(key === "price"){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            }
            else{
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((error, products)=>{
        if(error || !products){
            return res.json({
                error: 'Products not found'
            });
        }
        res.json({
            size: products.length,
            products
        });
    });
}

const photo = (req, res, next)=>{
    if(req.product.photo.data){
        res.set("Content-type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

const listSearch = (req, res)=>{
    const query={};

    if(req.query.search){
        // assign search value to query.name
        query.name = {$regex: req.query.search, $options: 'i'}
    }
    
    if(req.query.category && req.query.category != "All"){
        // assigne category value to query.category
        query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (error, products)=>{
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(products);
    }).select("-photo");
};

const decreaseQuantity = (req, res, next)=> {
    let bulkOps = req.body.order.products.map((item)=> {
        return {
            updateOne : {
            filter: {_id: item._id},
            update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    });

    Product.bulkWrite(bulkOps, {}, (error, data)=>{
        if(error){
            return res.status(400).json({
                error: error
            })
        }
        next();
    })
}

export default {create, productById, read, remove, update, list, listCategories, listRelated, listBySearch, listSearch, photo, decreaseQuantity};