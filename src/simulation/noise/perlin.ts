import { createNoise2D } from 'simplex-noise';

/**
 * Perlin/Simplex Noise Generator
 * Provides smooth, correlated drift over time.
 */
export class SimplexDrift {
  private noise2D: (x: number, y: number) => number;
  private time: number = 0;

  constructor(
    private scale: number = 1.0,
    private speed: number = 0.01
  ) {
    this.noise2D = createNoise2D();
  }

  /**
   * Generates the next noise value in the sequence
   */
  generate(): number {
    this.time += this.speed;
    return this.noise2D(this.time, 0) * this.scale;
  }

  /**
   * Applies noise to a value
   */
  apply(value: number): number {
    return value + this.generate();
  }
}
