import dotenv from 'dotenv';

dotenv.config();

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required environment variables
if (!config.geminiApiKey) {
  throw new Error('GEMINI_API_KEY is required. Please set it in your .env file.');
}

