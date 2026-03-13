import pkg from 'pg';
const { Pool } = pkg;
import { SimulationPacket } from '../shared/schema.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Storage Manager
 * Handles connection to TimescaleDB and implements batch-write logic.
 */
export class StorageManager {
  private pool: Pool;
  private buffer: any[] = [];
  private batchSize: number = 100;
  private flushIntervalMs: number = 5000;
  private timer: NodeJS.Timeout | null = null;

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
    });
  }

  /**
   * Initializes the database schema and hypertables
   */
  async init(): Promise<void> {
    const client = await this.pool.connect();
    try {
      // Create metrics table
      await client.query(`
        CREATE TABLE IF NOT EXISTS campus_metrics (
          time TIMESTAMPTZ NOT NULL,
          node_id TEXT NOT NULL,
          type TEXT NOT NULL,
          value DOUBLE PRECISION NOT NULL,
          metadata JSONB
        );
      `);

      // Convert to hypertable (TimescaleDB specific)
      // We wrap in try/catch because create_hypertable fails if already a hypertable
      try {
        await client.query("SELECT create_hypertable('campus_metrics', 'time', if_not_exists => TRUE);");
      } catch (e) {
        // Ignore if already hypertable or extension not loaded
        console.warn('Could not create hypertable. Ensure TimescaleDB extension is enabled if using Timescale.', e);
      }

      console.log('✅ Database initialized');
    } finally {
      client.release();
    }
  }

  /**
   * Adds a packet to the buffer
   */
  async add(packet: SimulationPacket): Promise<void> {
    const timestamp = new Date(packet.timestamp);

    // Flatten packet into individual metric rows
    // Solar
    this.buffer.push([timestamp, 'solar', 'power', packet.solar.power]);

    // Grid
    this.buffer.push([timestamp, 'grid', 'voltage', packet.grid.voltage]);
    this.buffer.push([timestamp, 'grid', 'frequency', packet.grid.frequency]);
    this.buffer.push([timestamp, 'grid', 'isAvailable', packet.grid.isAvailable ? 1 : 0]);

    // Rooms
    packet.rooms.forEach(room => {
      this.buffer.push([timestamp, `room:${room.name}`, 'power', room.power]);
      this.buffer.push([timestamp, `room:${room.name}`, 'occupancy', room.occupancy]);
    });

    // Aggregates
    this.buffer.push([timestamp, 'campus', 'totalDemand', packet.totalDemand]);
    this.buffer.push([timestamp, 'campus', 'netGridImpact', packet.netGridImpact]);

    if (this.buffer.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Flushes the buffer to the database
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const toWrite = [...this.buffer];
    this.buffer = [];

    const client = await this.pool.connect();
    try {
      // Using UNNEST for efficient batch insertion in PG
      // Format: [ [t1, id1, type1, v1], [t2, id2, type2, v2], ... ]
      const query = `
        INSERT INTO campus_metrics (time, node_id, type, value)
        SELECT * FROM UNNEST($1::timestamptz[], $2::text[], $3::text[], $4::double precision[])
      `;

      const times = toWrite.map(row => row[0]);
      const nodeIds = toWrite.map(row => row[1]);
      const types = toWrite.map(row => row[2]);
      const values = toWrite.map(row => row[3]);

      await client.query(query, [times, nodeIds, types, values]);
      console.log(`💾 Persisted ${toWrite.length} metrics to DB`);
    } catch (error) {
      console.error('❌ Failed to flush metrics to DB:', error);
      // Put back in buffer? Or log and drop to prevent memory leak.
      // For now, we drop but log.
    } finally {
      client.release();
    }
  }

  /**
   * Starts the periodic flush timer
   */
  startFlushTimer(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.flush(), this.flushIntervalMs);
  }

  /**
   * Stops the timer and closes the pool
   */
  async close(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    await this.flush();
    await this.pool.end();
  }
}
