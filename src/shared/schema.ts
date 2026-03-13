import { z } from 'zod';

// Schema for simulation data packet
export const SimulationPacketSchema = z.object({
  timestamp: z.string(),
  solar: z.object({
    power: z.number(),
  }),
  grid: z.object({
    voltage: z.number(),
    frequency: z.number(),
    isAvailable: z.boolean(),
  }),
  rooms: z.array(z.object({
    name: z.string(),
    power: z.number(),
    occupancy: z.number(),
  })),
  totalDemand: z.number(),
  netGridImpact: z.number(),
});

export type SimulationPacket = z.infer<typeof SimulationPacketSchema>;
