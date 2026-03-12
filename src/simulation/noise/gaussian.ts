import { random } from 'mathjs';

/**
 * Gaussian Noise Generator
 * Provides stochastic jitter around a mean value.
 */
export class GaussianNoise {
  constructor(private standardDeviation: number = 1.0) {}

  /**
   * Generates a noise value using Box-Muller transform
   */
  generate(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * this.standardDeviation;
  }

  /**
   * Applies noise to a value
   */
  apply(value: number): number {
    return value + this.generate();
  }
}
