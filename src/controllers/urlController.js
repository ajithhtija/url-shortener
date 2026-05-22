import { customAlphabet } from 'nanoid';
import QRCode from 'qrcode';
import Url from '../models/Url.js';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

export const createShortUrl = async (req, res) => {
  const { originalUrl, customId } = req.body;
  const userId = req.session.userId;

  if (!originalUrl) return res.status(400).json({ message: 'originalUrl is required' });

  try {
    // Check if originalUrl already exists for this user
    const existing = await Url.findOne({ originalUrl, userId });
    if (existing) {
      return res.status(200).json({ 
        originalUrl: existing.originalUrl, 
        shortId: existing.shortId,
        message: 'URL already shortened'
      });
    }

    const shortId = customId || nanoid();

    // Check if customId is already in use
    if (customId) {
      const customExists = await Url.findOne({ shortId: customId });
      if (customExists) return res.status(409).json({ message: 'shortId already in use' });
    }

    const url = new Url({ userId, originalUrl, shortId });
    await url.save();
    res.status(201).json({ originalUrl, shortId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listUrls = async (req, res) => {
  const userId = req.session.userId;
  const urls = await Url.find({ userId }).select('-__v').sort({ createdAt: -1 });
  res.json(urls);
};

export const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  try {
    const url = await Url.findByIdAndDelete(id);
    if (!url) return res.status(404).json({ message: 'URL not found' });
    if (url.userId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });
    res.json({ message: 'URL deleted', shortId: url.shortId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateQRCode = async (req, res) => {
  const { shortId } = req.params;
  try {
    const shortUrl = `${req.get('origin')}/${shortId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);
    res.json({ qrCode: qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};
