import express from 'express';
import { createShortUrl, listUrls, deleteUrl, generateQRCode } from '../controllers/urlController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/', isAuthenticated, createShortUrl);
router.get('/', isAuthenticated, listUrls);
router.delete('/:id', isAuthenticated, deleteUrl);
router.get('/qr/:shortId', generateQRCode);

export default router;
