import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb_uri_exists: !!MONGODB_URI
  });
}