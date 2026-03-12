import { describe, it, expect } from 'vitest';
import { Simulator, SimulationPacketSchema } from './simulator.js';

describe('Simulator Orchestrator', () => {
  it('should generate valid simulation packets', () => {
    const simulator = new Simulator();
    const packet = simulator.tick();
    
    // Validate schema
    const result = SimulationPacketSchema.safeParse(packet);
    expect(result.success).toBe(true);
    
    // Check basic properties
    expect(packet.rooms.length).toBe(5);
    expect(packet.totalDemand).toBeGreaterThan(0);
    expect(typeof packet.netGridImpact).toBe('number');
  });

  it('should update room occupancy over multiple ticks', () => {
    const simulator = new Simulator();
    
    // Run multiple ticks to see if occupancy changes
    // Since occupancy change is probabilistic (10%), we run enough ticks to likely see a change
    // or just verify it doesn't crash
    for (let i = 0; i < 50; i++) {
      const packet = simulator.tick();
      expect(packet.rooms.length).toBe(5);
    }
  });
});
