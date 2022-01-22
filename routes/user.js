import express from 'express';
import userController from '../controllers/user.js';
import authController from '../controllers/auth.js';

const router = express.Router();
router.get('/secret/:userId', authController.requireSignin, authController.isAuth, authController.isAdmin, (req, res)=>{
    res.json({
        user: req.profile
    });
})
router.get('/user/:userId', authController.requireSignin, authController.isAuth, userController.read);
router.put('/user/:userId', authController.requireSignin, authController.isAuth, userController.update);
router.get('/orders/by/user/:userId', authController.requireSignin, authController.isAuth, userController.purchaseHistory);

router.param("userId", userController.userByid);

export default router;