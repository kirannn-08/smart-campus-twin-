import { describe, it, expect } from 'vitest';
import { GaussianNoise } from './noise/gaussian.ts';
import { SimplexDrift } from './noise/perlin.ts';

describe('Noise Engines', () => {
  it('GaussianNoise should generate jitter around mean', () => {
    const noise = new GaussianNoise(10.0);
    const samples = Array.from({ length: 1000 }, () => noise.generate());
    
    // Average should be near zero
    const average = samples.reduce((a, b) => a + b) / samples.length;
    expect(Math.abs(average)).toBeLessThan(2.0); // Within tolerance
    
    // Some samples should be positive, some negative
    const positive = samples.filter(s => s > 0).length;
    expect(positive).toBeGreaterThan(400);
    expect(positive).toBeLessThan(600);
  });

  it('SimplexDrift should generate smooth drift', () => {
    const noise = new SimplexDrift(100.0, 0.1);
    const s1 = noise.generate();
    const s2 = noise.generate();
    const s3 = noise.generate();
    
    // Values should change but not jump wildly
    // Increased tolerance slightly for 2D mapping (was 20.0)
    expect(Math.abs(s2 - s1)).toBeLessThan(30.0);
    expect(Math.abs(s3 - s2)).toBeLessThan(30.0);
  });
});
