import { noise, noiseSeed } from '@chriscourses/perlin-noise';

export function perlin(seed, x, y, z) {
  noiseSeed(seed);
  return noise(x, y, z);
}
