# GPT Device Bridge – Node.js + WebSocket + Serial + GPT-4

A project by **Riccardo Mantelli**

This project weaves together language, code, and tangible matter. At its core, it listens—waiting for a sentence, a breath, a gesture—then replies by moving electrons, lighting diodes, sounding alarms. It bridges the invisible and the material, turning spoken intention into action.

Hosted on an AWS EC2 instance, it invites interaction between distant minds and local machines, through websockets and serial pulses.

---

## Features

- Translates natural language into structured, machine-readable intentions
- REST API for direct instruction delivery
- GPT-powered interpretation of loosely-formed human queries
- WebSocket communication for spatial and real-time presence
- Serial communication with microcontrollers (Arduino)
- A system that listens deeply, and responds by shaping the world

---

## System Architecture

```
[Prompt or Gesture] → /prompt → [Bridge Server + GPT-4] → { device, action } → WebSocket / Serial → [Material Response]
```

---

## Server (AWS EC2)

The bridge listens.
It exposes two surfaces:

### `/command`
For precise, controlled interaction.
```json
{
  "device": "led1",
  "action": "turnOn"
}
```

### `/prompt`
For open-ended expressions.
```json
{
  "prompt": "Turn on the red light when the figure lifts its arms"
}
```
It interprets. Translates. Then delivers:
```json
{
  "device": "led rosso",
  "action": "turnOn"
}
```

### Stack
- Node.js + Express
- OpenAI GPT-4 API
- socket.io
- dotenv
- body-parser

---

## Local Relay (macOS/Linux)

A quiet listener, the local client binds remote meaning to local matter.
It connects via WebSocket to the server, then writes directly to a serial port.

```bash
node local.js
```

### Install dependencies
```bash
npm install serialport socket.io-client
```

### Set paths
```js
const SERIAL_PORT_PATH = '/dev/tty.usbmodem1101';
const WS_SERVER_URL = 'ws://<EC2_PUBLIC_IP>:4000';
```

---

## Arduino Sketch

The microcontroller waits in a loop, attentive.
It receives a line, parses intent, and acts.
```cpp
if (cmd.indexOf("led rosso") > -1 && cmd.indexOf("turnOn") > -1) {
  digitalWrite(13, HIGH);
}
```

Commands arrive in stringified JSON, like wind carrying a whisper.

---

## Use Cases

- A gesture in space triggers a ritual sequence
- A whisper to GPT becomes an architectural shift in light
- A story unfolds through posture and silence
- Machines as companions, not just tools

---

## Installation
For pragmatic steps and configuration, see the [INSTALL.md](./INSTALL.md).

---

## License
MIT License

---

For collaborations, custom adaptations, or poetic circuits:
**riccardomantelli.com**  
**111@11-11.io**

