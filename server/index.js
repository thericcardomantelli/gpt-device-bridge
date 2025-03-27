// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server); // WebSocket server

const PORT = process.env.PORT || 4000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// GPT-4 configuration
const configuration = new Configuration({
  apiKey: OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());

// Store connected clients
let connectedClients = [];

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected via WebSocket:', socket.id);
  connectedClients.push(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients = connectedClients.filter(s => s.id !== socket.id);
  });
});

// POST /command → Direct command forwarding to clients
app.post('/command', (req, res) => {
  const { device, action } = req.body;

  if (!device || !action) {
    return res.status(400).json({ error: 'device and action are required' });
  }

  const payload = JSON.stringify({ device, action });

  connectedClients.forEach(socket => {
    socket.send(payload);
  });

  res.json({ status: 'command sent', payload });
});

// POST /prompt → GPT interpretation, then forwarded as command
app.post('/prompt', async (req, res) => {
  const userPrompt = req.body.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Translate the user request into a device command JSON like: { "device": "led1", "action": "turnOn" }'
        },
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const assistantMessage = completion.data.choices[0].message.content;

    let command;
    try {
      command = JSON.parse(assistantMessage); // Attempt to parse GPT response
    } catch (e) {
      return res.status(500).json({ error: 'Invalid GPT output', raw: assistantMessage });
    }

    // Forward command to all WebSocket clients
    const payload = JSON.stringify(command);
    connectedClients.forEach(socket => {
      socket.send(payload);
    });

    res.json({ status: 'command sent from GPT', command });

  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to process prompt' });
  }
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
