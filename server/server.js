import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { queue } from 'bullmq';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (add here as you build)
// app.use('/upload', uploadRoute);
// app.use('/query', queryRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});


//STORES THE PDF IN UPLOADS FOLDER
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  await queue.add(
    'file-ready',
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    })
  );
  res.json({ message: 'uploaded' });
});

//ADDS PDF TO THE QUEUE USING REDIS AND BULLMQ
const queue = new Queue('file-upload-queue', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});