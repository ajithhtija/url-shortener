import express from 'express';
import { signup, signin, logout, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
