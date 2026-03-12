import { describe, it, expect } from 'vitest';
import { SolarModel } from './engines/solar.ts';
import { GridModel } from './engines/grid.ts';
import { RoomModel } from './engines/room.ts';

describe('Energy Engines', () => {
  it('SolarModel should follow diurnal curve', () => {
    const solar = new SolarModel(1000); // 1000W peak
    
    // Noon UTC should be peak (sin(PI/2) * 1000)
    const noon = new Date('2026-06-21T12:00:00Z');
    expect(solar.calculatePower(noon)).toBeCloseTo(1000, 0);
    
    // 6am UTC should be zero
    const morning = new Date('2026-06-21T06:00:00Z');
    expect(solar.calculatePower(morning)).toBe(0);

    // Midnight UTC should be zero
    const midnight = new Date('2026-06-21T00:00:00Z');
    expect(solar.calculatePower(midnight)).toBe(0);
  });

  it('GridModel should generate nominal values', () => {
    const grid = new GridModel(230, 50, 1.0); // 100% reliable for test
    const state = grid.generateState();
    
    expect(state.isAvailable).toBe(true);
    expect(state.voltage).toBeGreaterThan(210);
    expect(state.voltage).toBeLessThan(250);
    expect(state.frequency).toBeGreaterThan(49);
    expect(state.frequency).toBeLessThan(51);
  });

  it('RoomModel should calculate consumption based on occupancy', () => {
    const room = new RoomModel('Test Lab', 100, 150); // 100W base, 150W per person
    
    // Zero occupancy
    room.setOccupancy(0);
    let state = room.calculatePower();
    expect(state.occupancy).toBe(0);
    expect(state.power).toBeGreaterThan(90);
    expect(state.power).toBeLessThan(110);
    
    // 10 people
    room.setOccupancy(10);
    state = room.calculatePower();
    expect(state.occupancy).toBe(10);
    // Expected: 100 + (10 * 150) = 1600W
    expect(state.power).toBeGreaterThan(1500);
    expect(state.power).toBeLessThan(1700);
  });
});
