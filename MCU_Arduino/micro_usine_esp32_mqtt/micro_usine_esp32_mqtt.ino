#include "secret.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ESP32Servo.h>

/* ---------- Topics MQTT ---------- */
#define HEARTBEAT_TOPIC     "micro-usine/heartbeat"
#define SCROLL_TOPIC        "micro-usine/scroll"       // commandes entrantes
#define SCROLL_ACK_TOPIC    "micro-usine/scroll/ack"   // accusés vers supervision

/* ---------- Timings réseau ---------- */
#define HEARTBEAT_INTERVAL  5000UL
#define WIFI_RETRY_MIN      2000UL     // 2 s
#define WIFI_RETRY_MAX      60000UL    // 60 s
#define MQTT_RETRY_INTERVAL 5000UL
#define MQTT_MAX_PUB_FAILS  3          // échecs avant reconnexion forcée

/* ---------- Servo / geste de scroll ---------- */
#define SERVO_PIN     18

/* Calibration "up" (bas -> haut), reprise telle quelle de aws_v1 */
#define UP_POS_BAS       140
#define UP_POS_HAUT      30
#define UP_STEP_DELAY_MS 2UL
#define UP_PAUSE_ARRIVEE_MS 150UL      // pause en haut de course
#define UP_PAUSE_RESET_MS   800UL      // repos entre deux scrolls

/* Calibration "down" (haut -> bas), reprise telle quelle de v0_Dimitri */
#define DOWN_HAUT             30
#define DOWN_BAS              120
#define DOWN_STEP_DELAY_MS    3UL
#define DOWN_PAUSE_ARRIVEE_MS 200UL    // pause en bas de course
#define DOWN_PAUSE_RESET_MS   500UL    // repos entre deux scrolls

WiFiClientSecure net;
MQTTClient client(256);
Servo servo1;

unsigned long lastHeartbeat  = 0;
unsigned long nextWifiRetry  = 0;
unsigned long wifiRetryDelay = WIFI_RETRY_MIN;
unsigned long lastMqttRetry  = 0;
bool          wifiWasConnected = false;
uint8_t       pubFailCount     = 0;

/* Machine à états du scroll (non-bloquante : la boucle MQTT
 * et le heartbeat continuent de tourner pendant le geste). */
enum ScrollState { IDLE, SLIDING, PAUSE_ARRIVEE, PAUSE_RESET };
ScrollState   scrollState   = IDLE;
int           servoPos      = UP_POS_BAS;
unsigned long lastServoStep = 0;
unsigned long pauseUntil    = 0;

/* File d'attente des directions demandées ('u' = up, 'd' = down) */
#define QUEUE_SIZE 20
char          scrollQueue[QUEUE_SIZE];
int           queueHead = 0, queueTail = 0, queueCount = 0;
char          currentDir = 'u';

bool enqueueScroll(char dir) {
  if (queueCount >= QUEUE_SIZE) return false;   // file pleine, on ignore
  scrollQueue[queueTail] = dir;
  queueTail = (queueTail + 1) % QUEUE_SIZE;
  queueCount++;
  return true;
}

bool dequeueScroll(char &dir) {
  if (queueCount == 0) return false;
  dir = scrollQueue[queueHead];
  queueHead = (queueHead + 1) % QUEUE_SIZE;
  queueCount--;
  return true;
}

/* Ferme MQTT + socket TLS. Sans net.stop(), la session TLS
 * reste "zombie" après une coupure : les publish partent dans le vide. */
void resetConnections() {
  client.disconnect();
  net.stop();
}

void publishAck(const String &msg) {
  if (client.connected()) {
    client.publish(SCROLL_ACK_TOPIC, msg);
  }
  Serial.println("[SCROLL] " + msg);
}

/* Arrêt d'urgence logiciel : stoppe le geste et vide la file. */
void emergencyStop() {
  scrollState = IDLE;
  queueHead = queueTail = queueCount = 0;
  servoPos  = UP_POS_BAS;
  servo1.write(UP_POS_BAS);
  publishAck("{\"status\":\"stopped\"}");
}

/* Réception des commandes : "up", "down", "stop" */
void messageReceived(String &topic, String &payload) {
  Serial.println("[MQTT] Reçu sur " + topic + " : " + payload);
  if (topic != SCROLL_TOPIC) return;

  payload.trim();
  payload.toLowerCase();

  if (payload == "stop") {
    emergencyStop();
    return;
  }

  if (payload == "up" || payload == "down") {
    char dir = (payload == "up") ? 'u' : 'd';
    if (enqueueScroll(dir)) {
      publishAck("{\"status\":\"accepted\",\"direction\":\"" + payload + "\"}");
    } else {
      publishAck("{\"status\":\"error\",\"reason\":\"file pleine\"}");
    }
  } else {
    publishAck("{\"status\":\"error\",\"reason\":\"commande inconnue\"}");
  }
}

/* Avance la machine à états du geste, un pas à la fois, sans delay(). */
void handleScroll() {
  unsigned long now = millis();

  switch (scrollState) {

    case IDLE: {
      char dir;
      if (dequeueScroll(dir)) {
        currentDir = dir;
        servoPos    = (dir == 'u') ? UP_POS_BAS : DOWN_HAUT;
        scrollState = SLIDING;
        publishAck("{\"status\":\"scrolling\",\"direction\":\"" + String(dir == 'u' ? "up" : "down") +
                    "\",\"remaining\":" + String(queueCount) + "}");
      }
      break;
    }

    case SLIDING: {
      unsigned long stepDelay = (currentDir == 'u') ? UP_STEP_DELAY_MS : DOWN_STEP_DELAY_MS;
      if (now - lastServoStep >= stepDelay) {
        lastServoStep = now;
        if (currentDir == 'u') {
          servoPos--;                          // glissement bas -> haut
          servo1.write(servoPos);
          if (servoPos <= UP_POS_HAUT) {
            scrollState = PAUSE_ARRIVEE;
            pauseUntil  = now + UP_PAUSE_ARRIVEE_MS;
          }
        } else {
          servoPos++;                          // glissement haut -> bas
          servo1.write(servoPos);
          if (servoPos >= DOWN_BAS) {
            scrollState = PAUSE_ARRIVEE;
            pauseUntil  = now + DOWN_PAUSE_ARRIVEE_MS;
          }
        }
      }
      break;
    }

    case PAUSE_ARRIVEE: {
      if ((long)(now - pauseUntil) >= 0) {
        int posRepos = (currentDir == 'u') ? UP_POS_BAS : DOWN_HAUT;
        servo1.write(posRepos);                // retour rapide
        servoPos    = posRepos;
        scrollState = PAUSE_RESET;
        pauseUntil  = now + (currentDir == 'u' ? UP_PAUSE_RESET_MS : DOWN_PAUSE_RESET_MS);
      }
      break;
    }

    case PAUSE_RESET: {
      if ((long)(now - pauseUntil) >= 0) {
        scrollState = IDLE;
        if (queueCount == 0) {
          publishAck("{\"status\":\"done\"}");
        }
      }
      break;
    }
  }
}

void connectMqtt() {
  Serial.print("[MQTT] Connexion à AWS... ");
  net.stop();                              // socket TLS propre
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  if (client.connect(THINGNAME)) {
    Serial.println("réussie");
    pubFailCount = 0;
    if (client.subscribe(SCROLL_TOPIC)) {
      Serial.println("[MQTT] Abonné à " SCROLL_TOPIC);
    } else {
      Serial.println("[MQTT] Échec d'abonnement à " SCROLL_TOPIC);
    }
  } else {
    Serial.printf("échec (lastError=%d)\n", client.lastError());
  }
}

void setup() {
  Serial.begin(115200);

  servo1.attach(SERVO_PIN);
  servo1.write(UP_POS_BAS);                // position de repos connue

  client.begin(AWS_IOT_ENDPOINT, 8883, net);
  client.onMessage(messageReceived);
  client.setKeepAlive(30);                 // détecte plus vite une session morte

  WiFi.setHostname("ESP32-Micro-Usine");
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(false);            // back-off géré manuellement
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("[WiFi] Première tentative de connexion");
  nextWifiRetry = millis() + WIFI_RETRY_MIN;
}

void loop() {
  /* ---- 0. Geste de scroll (fonctionne même hors connexion) ---- */
  handleScroll();

  /* ---- 1. Wi-Fi : reconnexion progressive (back-off) ---- */
  if (WiFi.status() != WL_CONNECTED) {
    if (wifiWasConnected) {
      Serial.println("[WiFi] Connexion perdue");
      wifiWasConnected = false;
      resetConnections();                  // tue la session TLS zombie
      wifiRetryDelay = WIFI_RETRY_MIN;
      nextWifiRetry  = millis();
    }
    if ((long)(millis() - nextWifiRetry) >= 0) {
      Serial.printf("[WiFi] Nouvelle tentative (délai suivant : %lu s)\n",
                    wifiRetryDelay / 1000);
      WiFi.disconnect();                   // état propre, fiable après reboot box
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
      nextWifiRetry  = millis() + wifiRetryDelay;
      wifiRetryDelay = min(wifiRetryDelay * 2UL, WIFI_RETRY_MAX);
    }
    delay(1);                              // ne pas bloquer le servo
    return;
  }

  /* ---- 2. Wi-Fi retrouvé ---- */
  if (!wifiWasConnected) {
    wifiWasConnected = true;
    wifiRetryDelay   = WIFI_RETRY_MIN;
    Serial.println("[WiFi] Réseau retrouvé");
    Serial.print("[WiFi] IP : "); Serial.println(WiFi.localIP());
    resetConnections();                    // force une session MQTT/TLS neuve
    lastMqttRetry = millis() - MQTT_RETRY_INTERVAL;  // essai MQTT immédiat
  }

  /* ---- 3. MQTT : (re)connexion ---- */
  if (!client.connected()) {
    if (millis() - lastMqttRetry >= MQTT_RETRY_INTERVAL) {
      lastMqttRetry = millis();
      connectMqtt();
    }
    delay(1);
    return;
  }

  client.loop();

  /* ---- 4. Heartbeat ---- */
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();
    if (client.publish(HEARTBEAT_TOPIC, "alive")) {
      Serial.println("[MQTT] Heartbeat envoyé");
      pubFailCount = 0;
    } else {
      Serial.println("[MQTT] Échec du heartbeat");
      if (++pubFailCount >= MQTT_MAX_PUB_FAILS) {
        Serial.println("[MQTT] Session morte, reconnexion forcée");
        resetConnections();
        pubFailCount  = 0;
        lastMqttRetry = millis() - MQTT_RETRY_INTERVAL;
      }
    }
  }

  delay(1);
}
