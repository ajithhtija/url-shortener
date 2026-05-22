import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connect from './utils/db.js';
import authRoutes from './routes/auth.js';
import urlRoutes from './routes/url.js';
import redirectRoutes from './routes/redirect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Auth routes (public)
app.use('/api/auth', authRoutes);

// URL routes (protected)
app.use('/api/url', urlRoutes);
app.use('/', redirectRoutes);

// Frontend: home page
app.get('/', async (req, res) => {
  res.render('index', { isAuthenticated: !!req.session.userId, userEmail: req.session.userEmail });
});

const port = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
