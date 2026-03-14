import { Simulator } from './simulator.js';
import dotenv from 'dotenv';

dotenv.config();

const isDebug = process.argv.includes('--debug');
const MQTT_URL = process.env.MQTT_URL;

const simulator = new Simulator(1000, MQTT_URL); // 1Hz

console.log('🚀 Smart Campus Energy Simulation Started');
if (MQTT_URL) {
  console.log(`📡 Publishing to MQTT: ${MQTT_URL}`);
}
console.log('---');

simulator.subscribe(packet => {
  if (isDebug) {
    console.log(`[${packet.timestamp}]`);
    console.log(`  Solar: ${packet.solar.power.toFixed(2)}W`);
    console.log(`  Grid: ${packet.grid.voltage.toFixed(1)}V / ${packet.grid.frequency.toFixed(2)}Hz (${packet.grid.isAvailable ? 'OK' : 'FAIL'})`);
    console.log(`  Demand: ${packet.totalDemand.toFixed(2)}W`);
    console.log(`  Net Grid Impact: ${packet.netGridImpact.toFixed(2)}W`);
    console.log('  Rooms:');
    packet.rooms.forEach(r => {
      console.log(`    - ${r.name}: ${r.power.toFixed(0)}W (Occupants: ${r.occupancy})`);
    });
    console.log('---');
  } else {
    // Standard compact output
    process.stdout.write(`\r[${packet.timestamp}] Net Impact: ${packet.netGridImpact.toFixed(0)}W | Total Demand: ${packet.totalDemand.toFixed(0)}W          `);
  }
});

simulator.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping simulation...');
  simulator.stop();
  process.exit();
});
