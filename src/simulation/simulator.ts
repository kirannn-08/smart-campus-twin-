import { SimulationPacket, SimulationPacketSchema } from '../shared/schema.js';
import { CampusNodes } from './nodes/index.js';
import mqtt, { MqttClient } from 'mqtt';

export class Simulator {
  private interval: NodeJS.Timeout | null = null;
  private listeners: ((packet: SimulationPacket) => void)[] = [];
  private mqttClient: MqttClient | null = null;

  constructor(
    private tickRateMs: number = 1000,
    private mqttUrl?: string
  ) {
    if (this.mqttUrl) {
      this.mqttClient = mqtt.connect(this.mqttUrl);
      this.mqttClient.on('connect', () => {
        console.log('📡 Simulator connected to MQTT');
      });
      this.mqttClient.on('error', (err) => {
        console.error('❌ Simulator MQTT error:', err);
      });
    }
  }

  /**
   * Starts the simulation loop
   */
  start(): void {
    if (this.interval) return;
    
    this.interval = setInterval(() => {
      const packet = this.tick();
      this.notify(packet);
    }, this.tickRateMs);
  }

  /**
   * Stops the simulation loop
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.mqttClient) {
      this.mqttClient.end();
      this.mqttClient = null;
    }
  }

  /**
   * Performs a single simulation tick
   */
  tick(): SimulationPacket {
    const now = new Date();
    
    // 1. Calculate Solar
    const solarPower = CampusNodes.solar.calculatePower(now);
    
    // 2. Get Grid State
    const gridState = CampusNodes.grid.generateState();
    
    // 3. Update and Calculate Rooms
    const roomStates = CampusNodes.rooms.map(room => {
      room.updateOccupancy();
      const state = room.calculatePower();
      return {
        name: state.name,
        power: state.power,
        occupancy: state.occupancy,
      };
    });
    
    // 4. Calculate Aggregate Metrics
    const totalDemand = roomStates.reduce((sum, room) => sum + room.power, 0);
    const netGridImpact = totalDemand - solarPower; // Positive means drawing from grid

    const packet: SimulationPacket = {
      timestamp: now.toISOString(),
      solar: { power: solarPower },
      grid: gridState,
      rooms: roomStates,
      totalDemand,
      netGridImpact,
    };

    // Validate with Zod
    const validatedPacket = SimulationPacketSchema.parse(packet);

    // Publish to MQTT if connected
    if (this.mqttClient && this.mqttClient.connected) {
      this.mqttClient.publish('campus/telemetry/packet', JSON.stringify(validatedPacket));
    }

    return validatedPacket;
  }

  /**
   * Subscribes to simulation updates
   */
  subscribe(callback: (packet: SimulationPacket) => void): void {
    this.listeners.push(callback);
  }

  private notify(packet: SimulationPacket): void {
    this.listeners.forEach(listener => listener(packet));
  }
}
