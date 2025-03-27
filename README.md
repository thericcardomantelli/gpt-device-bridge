# GPT Device Bridge – Node.js + WebSocket + Serial + GPT-4

A project by **Riccardo Mantelli**

This project bridges natural language input and physical computing systems using OpenAI GPT-4. Hosted on an AWS EC2 instance, it enables real-time interactions between human prompts and tangible outcomes via WebSocket and Serial communication.

---

## Features

- **GPT-4 Prompt Translation**: Converts natural language into structured device commands
- **REST API**: Direct `/command` and `/prompt` endpoints
- **WebSocket Bridge**: Communicates with local or remote devices (e.g., ESP32)
- **Serial Support**: Works seamlessly with Arduino via USB
- **Live Relay**: Routes actions in real time from GPT to hardware interfaces

---

## System Architecture

```
[User Prompt] → /prompt → [Node.js + GPT-4] → { device, action } → WebSocket/Serial → [Arduino or ESP32]
```

---

## Server (AWS EC2)

The server listens for two types of POST requests:

### `/command`
Sends a structured command directly to connected clients:
```json
{
  "device": "led1",
  "action": "turnOn"
}
```

### `/prompt`
Uses GPT-4 to interpret natural language prompts:
```json
{
  "prompt": "Turn on the red LED"
}
```
Generates a structured response and sends it to clients:
```json
{
  "device": "led rosso",
  "action": "turnOn"
}
```

### Technologies Used
- Node.js + Express
- OpenAI GPT-4 API
- socket.io
- dotenv
- body-parser

---

## Local Relay (macOS/Linux)

The local client connects to the EC2 server via WebSocket and forwards received messages to an Arduino connected via USB serial.

```bash
node local.js
```

### Dependencies
```bash
npm install serialport socket.io-client
```

### Configuration
Edit `local.js`:
```js
const SERIAL_PORT_PATH = '/dev/tty.usbmodem1101';
const WS_SERVER_URL = 'ws://<EC2_PUBLIC_IP>:4000';
```

---

## Arduino Sketch

The Arduino listens on serial for commands like:
```json
{"device":"led rosso","action":"turnOn"}
```
And responds accordingly:
```cpp
if (cmd.indexOf("led rosso") > -1 && cmd.indexOf("turnOn") > -1) {
  digitalWrite(13, HIGH);
}
```

---

## Use Cases
- Interactive spatial UX
- Gesture-to-device bridges (e.g., with ml5.js body pose)
- Performative installations
- Tangible narrative systems

---

## Installation
Refer to the [INSTALL.md](./INSTALL.md) file for a complete step-by-step deployment guide.

---

## License
MIT License

---

For collaborations, custom builds, or workshops:
**riccardomantelli.com**  
**111@11-11.io**
