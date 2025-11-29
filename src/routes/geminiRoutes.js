import express from 'express';
import { generateText, generateTextStream, chat } from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/gemini/generate
 * Generate text using Gemini API
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, ...options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const result = await generateText(prompt, options);

    if (result.success) {
      return res.json({
        success: true,
        data: {
          text: result.text,
        },
      });
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in /generate endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: error.details || error,
    });
  }
});

/**
 * POST /api/gemini/stream
 * Generate text using streaming mode
 */
router.post('/stream', async (req, res) => {
  try {
    const { prompt, ...options } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const stream = generateTextStream(prompt, options);

    try {
      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (streamError) {
      res.write(`data: ${JSON.stringify({ error: streamError.message, done: true })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Error in /stream endpoint:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
});

/**
 * POST /api/gemini/chat
 * Chat with Gemini using conversation history
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], ...options } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const result = await chat(history, message, options);

    if (result.success) {
      return res.json({
        success: true,
        data: {
          text: result.text,
          history: result.history,
        },
      });
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: error.details || error,
    });
  }
});

/**
 * GET /api/gemini/models
 * Get information about available models
 */
router.get('/models', (req, res) => {
  res.json({
    success: true,
    data: {
      availableModels: [
        {
          name: 'gemini-1.5-flash',
          description: 'Fast and versatile model for most tasks (default)',
          recommended: true,
        },
        {
          name: 'gemini-1.5-pro',
          description: 'Most capable model for complex tasks',
          recommended: false,
        },
      ],
      defaultModel: 'gemini-1.5-flash',
      note: 'You can specify a different model in the request body using the "model" parameter',
    },
  });
});

/**
 * GET /api/gemini/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gemini service is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;

