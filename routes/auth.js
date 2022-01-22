import express from 'express';
import authController from '../controllers/auth.js';
import useSignupValidator from '../validator/index.js';

const router = express.Router();
router.post('/signup',useSignupValidator ,authController.signup);
router.post('/signin', authController.signin);
router.get('/signout', authController.signout);

export default router;