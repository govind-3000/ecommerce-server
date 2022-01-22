import express from 'express';
import productController from '../controllers/product.js';
import authController from '../controllers/auth.js';
import userController from '../controllers/user.js';

const router = express.Router();

router.get('/product/photo/:productId', productController.photo);
router.get('/products/search', productController.listSearch);
router.get('/product/:productId', productController.read);
router.get('/products', productController.list);
router.get('/products/categories', productController.listCategories);
router.get('/products/related/:productId', productController.listRelated);
router.post('/products/by/search', productController.listBySearch);
router.post('/product/create/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin,
productController.create);
router.delete('/product/:productId/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin, productController.remove);
router.put('/product/:productId/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin, productController.update);

router.param('productId', productController.productById);
router.param('userId', userController.userByid);

export default router;