/**
 * Grid Power Stability Model
 * Simulates a reliable but slightly noisy grid connection.
 */
export class GridModel {
  constructor(
    private nominalVoltage: number = 230, // VAC
    private nominalFrequency: number = 50, // Hz
    private reliability: number = 0.9999 // Probability of being up
  ) {}

  /**
   * Generates grid state
   * @returns Object with grid metrics
   */
  generateState(): { voltage: number, frequency: number, isAvailable: boolean } {
    const isAvailable = Math.random() < this.reliability;
    
    if (!isAvailable) {
      return { voltage: 0, frequency: 0, isAvailable: false };
    }

    // Nominal voltage with +/- 5% random variation
    const voltageVariation = (Math.random() - 0.5) * 2 * (this.nominalVoltage * 0.05);
    const voltage = this.nominalVoltage + voltageVariation;
    
    // Nominal frequency with +/- 0.1% random variation
    const frequencyVariation = (Math.random() - 0.5) * 2 * (this.nominalFrequency * 0.001);
    const frequency = this.nominalFrequency + frequencyVariation;

    return { voltage, frequency, isAvailable };
  }
}
