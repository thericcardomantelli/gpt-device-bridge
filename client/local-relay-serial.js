// Required modules
const SerialPort = require('serialport');
const WebSocket = require('ws');

// Set your serial port (e.g., COM3 on Windows or /dev/ttyUSB0 on Linux)
const SERIAL_PORT_PATH = '/dev/ttyUSB0'; // Change this according to your system
const WS_SERVER_URL = 'ws://16.170.236.16:4000'; // Replace with your EC2 server URL

// Create serial port connection
const port = new SerialPort(SERIAL_PORT_PATH, {
  baudRate: 9600,
});

// Open WebSocket connection to the bridge server
const ws = new WebSocket(WS_SERVER_URL);

ws.on('open', () => {
  console.log('🟢 WebSocket connection established with server');
});

ws.on('message', (data) => {
  console.log('📩 Command received from server:', data.toString());
  port.write(data.toString() + '\n', (err) => {
    if (err) {
      return console.error('❌ Error writing to serial port:', err.message);
    }
    console.log('➡️ Command sent to Arduino');
  });
});

ws.on('close', () => {
  console.log('🔌 WebSocket connection closed');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err.message);
});

// Listen to Arduino responses (optional)
port.on('data', (data) => {
  console.log('🖨️ Arduino says:', data.toString());
});
