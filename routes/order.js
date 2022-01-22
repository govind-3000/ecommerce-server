import express from 'express';
const router = express.Router();

import userController from '../controllers/user.js';
import authController from '../controllers/auth.js';
import braintreeController from '../controllers/braintree.js';
import orderController from '../controllers/order.js';
import productController from '../controllers/product.js';

router.post('/order/create/:userId', 
    authController.requireSignin, 
    authController.isAuth, 
    userController.addOrderToUserHistory, 
    productController.decreaseQuantity,
    orderController.create
    );

router.get('/order/list/:userId',authController.requireSignin, authController.isAuth, authController.isAdmin, orderController.listOrders);
router.get('/order/status-values/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin,  orderController.getStatusValues);
router.put('/order/:orderId/status/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin,  orderController.updateOrderStatus);

router.param('orderId', orderController.orderById)
router.param('userId', userController.userByid);

export default router;