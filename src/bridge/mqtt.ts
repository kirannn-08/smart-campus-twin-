import mqtt, { MqttClient as Client } from 'mqtt';
import { SimulationPacket } from '../shared/schema.js';

/**
 * MqttClient
 * Connects to an MQTT broker and subscribes to telemetry topics.
 */
export class MqttClient {
  private client: Client;
  private onMessageCallback: (packet: SimulationPacket) => void;

  constructor(brokerUrl: string, onMessage: (packet: SimulationPacket) => void) {
    this.onMessageCallback = onMessage;
    this.client = mqtt.connect(brokerUrl);

    this.setupEvents();
  }

  private setupEvents() {
    this.client.on('connect', () => {
      console.log('📡 Connected to MQTT broker');
      this.client.subscribe('campus/telemetry/#', (err) => {
        if (!err) {
          console.log('📡 Subscribed to campus/telemetry/#');
        } else {
          console.error('❌ Failed to subscribe:', err);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        // For simplicity, we assume any message on telemetry topics is a SimulationPacket
        this.onMessageCallback(payload as SimulationPacket);
      } catch (err) {
        console.error('❌ Error parsing MQTT message:', err);
      }
    });

    this.client.on('error', (err) => {
      console.error('❌ MQTT error:', err);
    });
  }

  public close() {
    this.client.end();
  }
}
