const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 4000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());

let connectedClients = [];

io.on('connection', (socket) => {
  console.log('WebSocket client connected:', socket.id);
  connectedClients.push(socket);

  socket.on('disconnect', () => {
    console.log('WebSocket client disconnected:', socket.id);
    connectedClients = connectedClients.filter(s => s.id !== socket.id);
  });
});

app.post('/command', (req, res) => {
  const { device, action } = req.body;

  if (!device || !action) {
    return res.status(400).json({ error: 'Missing device or action' });
  }

  const payload = JSON.stringify({ device, action });
  console.log('[COMMAND] Sending to clients:', payload);

  connectedClients.forEach(socket => socket.send(payload));

  res.json({ status: 'command sent', payload });
});

app.post('/prompt', async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log('[PROMPT] User said:', userPrompt);

  if (!userPrompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Translate the user request into a JSON device command like: {"device":"led1","action":"turnOn"}'
        },
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const assistantMessage = completion.choices[0].message.content;
    let command;

    try {
      command = JSON.parse(assistantMessage);
    } catch (err) {
      console.error('[GPT] Invalid JSON returned:', assistantMessage);
      return res.status(500).json({ error: 'GPT response is not valid JSON', raw: assistantMessage });
    }

    console.log('[GPT] Command parsed:', command);

    const payload = JSON.stringify(command);
    connectedClients.forEach(socket => socket.send(payload));

    res.json({ status: 'command sent from GPT', command });

  } catch (err) {
    console.error('[GPT] API error:', err);
    res.status(500).json({ error: 'Failed to contact GPT API' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Server listening on port ${PORT}');
});