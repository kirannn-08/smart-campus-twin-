import { SolarModel } from '../engines/solar.js';
import { GridModel } from '../engines/grid.js';
import { RoomModel } from '../engines/room.js';

export const CampusNodes = {
  solar: new SolarModel(8000), // 8kW peak array
  grid: new GridModel(230, 50, 0.999), // Reliable grid
  rooms: [
    new RoomModel('Research Lab 1', 500, 200, 20),
    new RoomModel('Research Lab 2', 600, 200, 15),
    new RoomModel('Classroom A', 100, 100, 40),
    new RoomModel('Classroom B', 100, 100, 40),
    new RoomModel('Main Office', 200, 150, 10),
  ]
};
