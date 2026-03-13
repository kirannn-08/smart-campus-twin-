import { SimulationPacket, SimulationPacketSchema } from '../shared/schema.js';
import { CampusNodes } from './nodes/index.js';

export class Simulator {
  private interval: NodeJS.Timeout | null = null;
  private listeners: ((packet: SimulationPacket) => void)[] = [];

  constructor(private tickRateMs: number = 1000) {}

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
    return SimulationPacketSchema.parse(packet);
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
