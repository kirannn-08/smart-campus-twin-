/**
 * Solar Power Generation Model
 * Simulates a diurnal solar curve with optional noise.
 */
export class SolarModel {
  constructor(
    private peakPower: number = 5000, // Peak W at noon
    private latitude: number = 45.0,
    private dayOfYear: number = 172 // Summer solstice default
  ) {}

  /**
   * Calculates solar power for a given date/time
   * @param date The date/time to calculate for
   * @returns Power in Watts (0-peakPower)
   */
  calculatePower(date: Date): number {
    const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    
    // Simple sinusoidal model: max at 12:00, 0 before sunrise and after sunset
    // Assuming 12-hour day from 6:00 to 18:00 UTC for simplicity
    if (hours < 6 || hours > 18) {
      return 0;
    }

    // Normalized time: 0 at 6am, 0.5 at 12pm, 1 at 6pm
    const normalizedTime = (hours - 6) / 12;
    
    // Sin curve: sin(0) = 0, sin(PI/2) = 1, sin(PI) = 0
    const power = Math.sin(normalizedTime * Math.PI) * this.peakPower;
    
    return Math.max(0, power);
  }
}
