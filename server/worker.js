// worker.js
import { Worker } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new Redis('rediss://default:ASjNAAIjcDFiMjI3NzE0YmRhYWY0MzVjYTIxYmJkMjdmYTcyMzk2ZnAxMA@fit-bunny-10445.upstash.io:6379', {
  maxRetriesPerRequest: null, // ✅ Required for BullMQ
});

const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    console.log('Processing job:', job.id);
    console.log('Job data:', job.data);

    // Process your PDF here
    // Example: extract text, store metadata, etc.

    return { status: 'done' };
  },
  {
    connection: redisConnection,
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});
