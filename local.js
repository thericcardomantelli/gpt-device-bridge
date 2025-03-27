const { SerialPort } = require('serialport');
const { io } = require('socket.io-client');

const SERIAL_PORT_PATH = '/dev/tty.usbmodem1101'; // ← sostituisci con la tua porta
const WS_SERVER_URL = 'http://16.170.236.16:4000'; // ← server EC2

// Serial connection
const port = new SerialPort({
  path: SERIAL_PORT_PATH,
  baudRate: 9600,
});

port.on('open', () => {
  console.log('🔌 Serial port opened');
});

port.on('data', (data) => {
  console.log('🖨️ Arduino says:', data.toString());
});

// WebSocket client with socket.io
const socket = io(WS_SERVER_URL);

socket.on('connect', () => {
  console.log('🟢 Connected to GPT bridge server via socket.io');
});

socket.on('message', (data) => {
  const msg = data.toString().trim();
  console.log('📩 Command received from server:', msg);

  port.write(msg + '\n', (err) => {
    if (err) {
      return console.error('❌ Error writing to serial:', err.message);
    }
    console.log('➡️ Sent to Arduino via serial');
  });
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from GPT bridge server');
});
