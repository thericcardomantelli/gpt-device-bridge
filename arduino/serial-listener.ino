String input = "";

void setup() {
  Serial.begin(9600); // Initialize serial communication
  pinMode(13, OUTPUT); // Built-in LED on most Arduino boards
  Serial.println("Arduino ready");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      processCommand(input);
      input = ""; // Reset input string
    } else {
      input += c;
    }
  }
}

void processCommand(String cmd) {
  Serial.print("Received: ");
  Serial.println(cmd);

  if (cmd == "led1:turnOn") {
    digitalWrite(13, HIGH);
    Serial.println("LED ON");
  } else if (cmd == "led1:turnOff") {
    digitalWrite(13, LOW);
    Serial.println("LED OFF");
  } else {
    Serial.println("Unknown command");
  }
}
