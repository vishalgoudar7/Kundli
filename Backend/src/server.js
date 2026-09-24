import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import kundliRoutes from './routes/kundli.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(
  '/api/auth',
  authRoutes
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kundli-node-mongodb' });
});

app.use('/api/kundli', kundliRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

console.log(
  'JWT configured:',
  Boolean(process.env.JWT_SECRET)
);

connectDB()
  .then(() => app.listen(port, () => console.log(`Kundli API running on port ${port}`)))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
