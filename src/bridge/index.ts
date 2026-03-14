import { createServer } from 'http';
import { SocketServer } from './socket.js';
import { MqttClient } from './mqtt.js';
import { StorageManager } from './storage.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.BRIDGE_PORT || 3001;
const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1883';

async function main() {
  console.log('🚀 Starting Data Bridge...');

  // 1. Initialize Storage
  const storage = new StorageManager();
  await storage.init();
  storage.startFlushTimer();

  // 2. Initialize Socket.io
  const httpServer = createServer();
  const socketServer = new SocketServer(httpServer);

  // 3. Initialize MQTT and link everything
  const mqttClient = new MqttClient(MQTT_URL, async (packet) => {
    // Broadcast to WebSocket clients
    socketServer.broadcast(packet);

    // Save to database
    await storage.add(packet);
  });

  httpServer.listen(PORT, () => {
    console.log(`📡 Bridge listening on port ${PORT}`);
    console.log(`📡 Bridging MQTT (${MQTT_URL}) -> WebSockets & DB`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down bridge...');
    mqttClient.close();
    socketServer.close();
    await storage.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Only run if called directly
if (import.meta.url.endsWith(process.argv[1]) || process.env.NODE_ENV === 'production') {
  main().catch(err => {
    console.error('❌ Bridge crash:', err);
    process.exit(1);
  });
}

export { main };
