import { GaussianNoise } from '../noise/gaussian.js';

/**
 * Room Consumption Model
 * Simulates occupancy-driven power usage with a base phantom load.
 */
export class RoomModel {
  private occupancy: number = 0;
  private noise: GaussianNoise;

  constructor(
    private name: string,
    private baseLoad: number = 100, // Watts (phantom load)
    private perPersonLoad: number = 150, // Watts per occupant
    private maxOccupancy: number = 30
  ) {
    this.noise = new GaussianNoise(baseLoad * 0.05); // 5% jitter
  }

  /**
   * Updates occupancy using a simple random walk
   */
  updateOccupancy(): number {
    const change = Math.random() > 0.5 ? 1 : -1;
    const probability = 0.1; // 10% chance to change occupancy per tick
    
    if (Math.random() < probability) {
      this.occupancy = Math.max(0, Math.min(this.maxOccupancy, this.occupancy + change));
    }
    
    return this.occupancy;
  }

  /**
   * Sets a specific occupancy
   */
  setOccupancy(count: number): void {
    this.occupancy = Math.max(0, Math.min(this.maxOccupancy, count));
  }

  /**
   * Calculates current power consumption
   */
  calculatePower(): { 
    name: string, 
    power: number, 
    occupancy: number,
    baseLoad: number,
    occupantLoad: number
  } {
    const occupantLoad = this.occupancy * this.perPersonLoad;
    const totalLoad = this.baseLoad + occupantLoad;
    const noisyLoad = this.noise.apply(totalLoad);

    return {
      name: this.name,
      power: Math.max(0, noisyLoad),
      occupancy: this.occupancy,
      baseLoad: this.baseLoad,
      occupantLoad
    };
  }
}
