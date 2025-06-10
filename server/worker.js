// worker.js
import { Worker } from 'bullmq';
import { QdrantVectorStore } from '@langchain/qdrant';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import Redis from 'ioredis';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Upstash Redis connection (make sure your URL and token are correct)
const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Custom Hugging Face embeddings class
class HuggingFaceEmbeddings {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.apiUrl = 'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction';
  }

  async embedDocuments(documents) {
    const texts = documents.map((doc) => doc.pageContent || doc);
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

// Create a worker to process jobs from 'file-upload-queue'
const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    console.log(`Received job data:`, job.data);

    // job.data should be an object, no need to parse JSON if you add job with an object
    const data = job.data;
    console.log(`Processing file at path: ${data.path}`);

    // Load PDF file and extract text pages
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents from PDF.`);
    console.log(`Sample document text (first 200 chars):`, docs[0]?.pageContent?.substring(0, 200));

    try {
      // Create Hugging Face embeddings instance
      const embeddings = new HuggingFaceEmbeddings(process.env.HUGGINGFACE_API_KEY);
      console.log('Created HuggingFaceEmbeddings instance.');

      // Connect to Qdrant vector store collection
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: process.env.QDRANT_URL,
          apiKey: process.env.QDRANT_API_KEY,
          collectionName: process.env.QDRANT_COLLECTION,
        }
      );
      console.log('Connected to Qdrant vector store collection.');

      // Add documents to Qdrant vector store
      await vectorStore.addDocuments(docs);
      console.log(`All documents added to the vector store.`);
    } catch (error) {
      console.error('❌ Error during embedding or vector store operation:');
      console.error(error);
    }
  },
  {
    concurrency: 100,
    connection: redisConnection, // Use Upstash Redis connection here
  }
);

console.log('Worker started and listening to file-upload-queue...');


//To check VectorDB:  https://85a09390-5455-4b6c-a8aa-0b527bb851b0.us-west-2-0.aws.cloud.qdrant.io:6333/dashboard#/collections