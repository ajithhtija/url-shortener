import express from 'express';
import Url from '../models/Url.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const url = await Url.findOne({ shortId: id });
  if (!url) return res.status(404).json({ message: 'Not found' });
  url.clicks += 1;
  await url.save();
  res.redirect(url.originalUrl);
});

export default router;
