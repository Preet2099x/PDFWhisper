// server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const app = express();
app.use(cors());
app.use(express.json());

// Redis connection to Upstash (same as worker.js)
const redisConnection = new Redis('rediss://default:ASjNAAIjcDFiMjI3NzE0YmRhYWY0MzVjYTIxYmJkMjdmYTcyMzk2ZnAxMA@fit-bunny-10445.upstash.io:6379',{
  maxRetriesPerRequest: null,
});

// BullMQ Queue
const queue = new Queue('file-upload-queue', {
  connection: redisConnection,
});

// Multer storage for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const uniqueId = Math.round(Math.random() * 1e9);
    cb(null, `${uniqueId}-${date}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload route — adds PDF to BullMQ queue
app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded' });
  }

  await queue.add('file-ready', {
    filename: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path,
  });

  res.json({ message: 'PDF uploaded and job queued' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
