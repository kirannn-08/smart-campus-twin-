import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageManager } from './storage.js';
import { SimulationPacket } from '../shared/schema.js';

// Mock pg Pool
vi.mock('pg', () => {
  const Pool = vi.fn(() => ({
    connect: vi.fn(() => ({
      query: vi.fn().mockResolvedValue({ rows: [], command: 'INSERT' }),
      release: vi.fn(),
    })),
    query: vi.fn(),
    end: vi.fn(),
  }));
  return { default: { Pool } };
});

describe('StorageManager', () => {
  let storage: StorageManager;

  const mockPacket: SimulationPacket = {
    timestamp: new Date().toISOString(),
    solar: { power: 1000 },
    grid: { voltage: 230, frequency: 50, isAvailable: true },
    rooms: [
      { name: 'Lab 1', power: 500, occupancy: 5 }
    ],
    totalDemand: 500,
    netGridImpact: -500
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storage = new StorageManager('postgresql://mock');
  });

  it('should accumulate packets in buffer and flush when batch size reached', async () => {
    // Default batch size is 100 metrics. 
    // One packet produces: 1 (solar) + 3 (grid) + 2 (per room) + 2 (campus) = 8 metrics per packet with 1 room.
    // So 13 packets should trigger a flush (13 * 8 = 104)
    
    const flushSpy = vi.spyOn(storage, 'flush');
    
    for (let i = 0; i < 12; i++) {
      await storage.add(mockPacket);
    }
    
    expect(flushSpy).not.toHaveBeenCalled();
    
    await storage.add(mockPacket); // 13th packet
    expect(flushSpy).toHaveBeenCalledTimes(1);
  });

  it('should flush on close', async () => {
    const flushSpy = vi.spyOn(storage, 'flush');
    await storage.add(mockPacket);
    expect(flushSpy).not.toHaveBeenCalled();
    
    await storage.close();
    expect(flushSpy).toHaveBeenCalledTimes(1);
  });
});
