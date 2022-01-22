import express from 'express';
const router = express.Router();

import userController from '../controllers/user.js';
import authController from '../controllers/auth.js';
import braintreeController from '../controllers/braintree.js';

router.get('/braintree/getToken/:userId', authController.requireSignin, authController.isAuth, braintreeController.generateToken);
router.post('/braintree/payment/:userId', authController.requireSignin, authController.isAuth, braintreeController.processPayment);
router.param('userId', userController.userByid);

export default router;