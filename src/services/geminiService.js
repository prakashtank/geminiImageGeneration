import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// Default model - using gemini-1.5-flash (faster and cost-effective)
// Available models: 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-vision'
const DEFAULT_MODEL = 'gemini-1.5-flash';

/**
 * Generate text using Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options for generation
 * @returns {Promise<Object>} The generated response
 */
export async function generateText(prompt, options = {}) {
  try {
    // Get the generative model (using gemini-1.5-flash by default)
    const model = genAI.getGenerativeModel({ 
      model: options.model || DEFAULT_MODEL,
    });

    // Configure generation settings
    const generationConfig = {
      temperature: options.temperature || 0.7,
      topP: options.topP || 0.8,
      topK: options.topK || 40,
      maxOutputTokens: options.maxOutputTokens || 2048,
      ...options.generationConfig,
    };

    // Generate content - simpler format
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      text,
      fullResponse: response,
    };
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw {
      success: false,
      error: error.message,
      details: error,
    };
  }
}

/**
 * Generate text using streaming mode
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options for generation
 * @returns {AsyncGenerator} Stream of text chunks
 */
export async function* generateTextStream(prompt, options = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: options.model || DEFAULT_MODEL,
    });

    const generationConfig = {
      temperature: options.temperature || 0.7,
      topP: options.topP || 0.8,
      topK: options.topK || 40,
      maxOutputTokens: options.maxOutputTokens || 2048,
      ...options.generationConfig,
    };

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error) {
    console.error('Error streaming text with Gemini:', error);
    throw error;
  }
}

/**
 * Chat with Gemini using conversation history
 * @param {Array} history - Conversation history array
 * @param {string} message - New message to add
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} The response and updated history
 */
export async function chat(history = [], message, options = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: options.model || DEFAULT_MODEL,
    });

    const generationConfig = {
      temperature: options.temperature || 0.7,
      topP: options.topP || 0.8,
      topK: options.topK || 40,
      maxOutputTokens: options.maxOutputTokens || 2048,
      ...options.generationConfig,
    };

    // Format history for Gemini API
    const contents = history.map(msg => ({
      role: msg.role || (msg.isUser ? 'user' : 'model'),
      parts: [{ text: msg.content || msg.text || msg.message }],
    }));

    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const result = await model.generateContent({
      contents,
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    // Update history
    const updatedHistory = [
      ...history,
      { role: 'user', content: message, isUser: true },
      { role: 'model', content: text, isUser: false },
    ];

    return {
      success: true,
      text,
      history: updatedHistory,
      fullResponse: response,
    };
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    throw {
      success: false,
      error: error.message,
      details: error,
    };
  }
}

