# Gemini Service

A Node.js REST API service for interacting with Google's Gemini AI API.

## Features

- 🚀 Generate text using Gemini AI
- 💬 Chat with conversation history support
- 📡 Streaming text generation (Server-Sent Events)
- 🔒 Environment-based configuration
- 🛡️ Error handling and validation

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Google Gemini API Key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/prakashtank/gemini-service.git
cd gemini-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## Usage

### Start the server:

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### 1. Generate Text

Generate text from a prompt.

**Endpoint:** `POST /api/gemini/generate`

**Request Body:**
```json
{
  "prompt": "Explain quantum computing in simple terms",
  "model": "gemini-pro",
  "temperature": 0.7,
  "maxOutputTokens": 2048
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Quantum computing is a type of computation..."
  }
}
```

### 2. Stream Text Generation

Generate text with streaming response (Server-Sent Events).

**Endpoint:** `POST /api/gemini/stream`

**Request Body:**
```json
{
  "prompt": "Write a short story about space exploration",
  "temperature": 0.8
}
```

**Response:** Server-Sent Events stream with chunks

### 3. Chat with History

Have a conversation with Gemini, maintaining context.

**Endpoint:** `POST /api/gemini/chat`

**Request Body:**
```json
{
  "message": "What's the capital of France?",
  "history": [
    {
      "role": "user",
      "content": "Hello!",
      "isUser": true
    },
    {
      "role": "model",
      "content": "Hello! How can I help you today?",
      "isUser": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "The capital of France is Paris.",
    "history": [
      // Updated history including the new exchange
    ]
  }
}
```

### 4. Health Check

Check if the service is running.

**Endpoint:** `GET /api/gemini/health`

**Response:**
```json
{
  "success": true,
  "message": "Gemini service is healthy",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Configuration Options

When making requests, you can include these optional parameters:

- `model` - The Gemini model to use (default: "gemini-pro")
- `temperature` - Controls randomness (0.0 to 1.0, default: 0.7)
- `topP` - Nucleus sampling parameter (default: 0.8)
- `topK` - Top-K sampling parameter (default: 40)
- `maxOutputTokens` - Maximum tokens in response (default: 2048)

## Project Structure

```
gemini-service/
├── src/
│   ├── config/
│   │   └── env.js           # Environment configuration
│   ├── services/
│   │   └── geminiService.js # Gemini API service logic
│   ├── routes/
│   │   └── geminiRoutes.js  # API routes
│   └── server.js            # Express server setup
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment file
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## License

ISC

