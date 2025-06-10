// server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Dropbox } from 'dropbox';
import stream from 'stream';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Redis connection (Upstash or other Redis instance)
const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// BullMQ queue setup
const queue = new Queue('file-upload-queue', {
  connection: redisConnection,
});

// Use memoryStorage for in-memory PDF processing
const upload = multer({ storage: multer.memoryStorage() });

// Dropbox setup
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

async function uploadToDropbox(fileBuffer, filename) {
  const dropboxPath = `/pdfwhisper_uploads/${filename}`;
  const response = await dbx.filesUpload({
    path: dropboxPath,
    contents: fileBuffer,
    mode: 'add',
  });

  console.log('✅ Uploaded to Dropbox:', response.result.path_display);
  return response.result;
}

// Route: Upload PDF and push to queue
app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded' });
  }

  const uniqueId = Math.round(Math.random() * 1e9);
  const date = new Date().toISOString().split('T')[0];
  const dropboxFilename = `${uniqueId}-${date}-${req.file.originalname}`;

  try {
    const dropboxFile = await uploadToDropbox(req.file.buffer, dropboxFilename);

    await queue.add('file-ready', {
      filename: req.file.originalname,
      dropboxPath: dropboxFile.path_display,
    });

    res.json({ message: 'PDF uploaded to Dropbox and job queued' });
  } catch (error) {
    console.error('❌ Dropbox upload or queue error:', error);
    res.status(500).json({ error: 'Failed to upload to Dropbox or add to queue' });
  }
});

// HuggingFace embedding class
class HuggingFaceEmbeddings {
  constructor(apiKey) {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.apiUrl = 'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction';
  }

  async embedDocuments(documents) {
    const texts = documents.map(doc => doc.pageContent || doc);
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: texts }),
    });

    const vectors = await response.json();

    if (!Array.isArray(vectors)) {
      throw new Error(`Hugging Face API error: ${JSON.stringify(vectors)}`);
    }
    return vectors;
  }

  async embedQuery(text) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    const vector = await response.json();

    if (!Array.isArray(vector)) {
      throw new Error(`Hugging Face API error: ${JSON.stringify(vector)}`);
    }
    return vector;
  }
}

// Chat route
app.get('/chat', async (req, res) => {
  try {
    const userQuery = req.query.message;
    if (!userQuery) return res.status(400).json({ error: 'Message query param required' });

    const embeddings = new HuggingFaceEmbeddings(process.env.HUGGINGFACE_API_KEY);

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: process.env.QDRANT_COLLECTION,
    });

    const retriever = vectorStore.asRetriever({ k: 2 });
    const result = await retriever.invoke(userQuery);

    const SYSTEM_PROMPT = `
You are a helpful AI Assistant. Use the following context extracted from documents to answer the user's query.

Context:
${JSON.stringify(result)}

Question: ${userQuery}

Answer:
`;

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer generated.';

    res.json({
      message: answer.trim(),
      docs: result,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
