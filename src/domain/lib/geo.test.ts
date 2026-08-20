import { distanceToSegmentKm, haversineKm } from './geo';

const RAJWADA = { lat: 22.7177, lng: 75.8545 };
const VIJAY_NAGAR = { lat: 22.7533, lng: 75.8937 };
const RAU = { lat: 22.642, lng: 75.806 };

describe('haversineKm()', () => {
  it('is zero for the same point', () => {
    expect(haversineKm(RAJWADA, RAJWADA)).toBeCloseTo(0, 5);
  });

  it('is symmetric', () => {
    expect(haversineKm(RAJWADA, VIJAY_NAGAR)).toBeCloseTo(haversineKm(VIJAY_NAGAR, RAJWADA), 9);
  });

  it('matches a known Indore distance', () => {
    // Rajwada to Vijay Nagar is roughly 5.5 km as the crow flies.
    expect(haversineKm(RAJWADA, VIJAY_NAGAR)).toBeGreaterThan(5);
    expect(haversineKm(RAJWADA, VIJAY_NAGAR)).toBeLessThan(6);
  });

  it('gets one degree of latitude about right', () => {
    // A degree of latitude is ~111 km anywhere on the globe.
    expect(haversineKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(111.19, 1);
  });

  it('orders near and far correctly', () => {
    expect(haversineKm(RAJWADA, VIJAY_NAGAR)).toBeLessThan(haversineKm(RAJWADA, RAU));
  });
});

describe('distanceToSegmentKm()', () => {
  it('is zero for a point sitting on the segment', () => {
    const mid = {
      lat: (RAJWADA.lat + VIJAY_NAGAR.lat) / 2,
      lng: (RAJWADA.lng + VIJAY_NAGAR.lng) / 2,
    };
    expect(distanceToSegmentKm(mid, RAJWADA, VIJAY_NAGAR)).toBeLessThan(0.05);
  });

  it('falls back to point distance when the segment has no length', () => {
    expect(distanceToSegmentKm(VIJAY_NAGAR, RAJWADA, RAJWADA)).toBeCloseTo(
      haversineKm(VIJAY_NAGAR, RAJWADA),
      3
    );
  });

  it('clamps to the endpoints rather than the infinite line', () => {
    // Rau is well past Rajwada, so the nearest point on the segment is Rajwada itself.
    const d = distanceToSegmentKm(RAU, RAJWADA, VIJAY_NAGAR);
    expect(d).toBeCloseTo(haversineKm(RAU, RAJWADA), 0);
  });

  it('never exceeds the distance to the closer endpoint', () => {
    const d = distanceToSegmentKm(RAU, RAJWADA, VIJAY_NAGAR);
    expect(d).toBeLessThanOrEqual(
      Math.min(haversineKm(RAU, RAJWADA), haversineKm(RAU, VIJAY_NAGAR)) + 0.01
    );
  });
});
