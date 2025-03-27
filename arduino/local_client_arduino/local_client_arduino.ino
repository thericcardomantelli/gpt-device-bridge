String input = "";

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT); // LED integrato su molti Arduino
  Serial.println("Arduino ready");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();

    if (c == '\n') {
      input.trim();            // Rimuove spazi e newline
      processCommand(input);   // Analizza comando
      input = "";              // Reset input
    } else {
      input += c;
    }
  }
}

void processCommand(String cmd) {
  Serial.print("DEBUG RAW [");
  Serial.print(cmd);
  Serial.println("]");

  if (cmd.indexOf("led rosso") > -1 && cmd.indexOf("turnOn") > -1) {
    digitalWrite(13, HIGH);
    Serial.println("LED ON");
  } else if (cmd.indexOf("led rosso") > -1 && cmd.indexOf("turnOff") > -1) {
    digitalWrite(13, LOW);
    Serial.println("LED OFF");
  } else {
    Serial.println("Unknown command");
  }
}
