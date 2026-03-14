import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

/**
 * SocketServer
 * Manages WebSocket connections and broadcasts real-time telemetry.
 */
export class SocketServer {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupEvents();
  }

  private setupEvents() {
    this.io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
      });
    });
  }

  /**
   * Broadcasts telemetry to all connected clients.
   * @param packet The simulation packet to broadcast.
   */
  public broadcast(packet: any): void {
    this.io.emit('telemetry', packet);
  }

  public close(): void {
    this.io.close();
  }
}
