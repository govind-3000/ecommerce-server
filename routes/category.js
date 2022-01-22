import express from 'express';
import categoryController from '../controllers/category.js';
import authController from '../controllers/auth.js';
import userController from '../controllers/user.js';

const router = express.Router();

router.get('/category/:categoryId', categoryController.read);
router.post('/category/create/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin,
categoryController.create);
router.put('/category/:categoryId/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin, 
categoryController.update);
router.delete('/category/:categoryId/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin, 
categoryController.remove);
router.get('/categories', categoryController.list);

router.param('userId', userController.userByid);
router.param('categoryId', categoryController.categoryById);
export default router;