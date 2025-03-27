#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  webSocket.begin("16.170.236.16", 4000, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  pinMode(2, OUTPUT);
}

void loop() {
  webSocket.loop();
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_TEXT) {
    String message = (const char*)payload;
    Serial.print("Received command: ");
    Serial.println(message);

    if (message == "{\"device\":\"led1\",\"action\":\"turnOn\"}") {
      digitalWrite(2, HIGH);
    } else if (message == "{\"device\":\"led1\",\"action\":\"turnOff\"}") {
      digitalWrite(2, LOW);
    }
  }
}
