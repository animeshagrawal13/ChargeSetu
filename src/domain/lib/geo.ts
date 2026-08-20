export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Shortest distance from a point to the straight segment a→b, in km.
 * Used by the trip planner to find chargers inside a corridor around the route.
 */
export function distanceToSegmentKm(point: LatLng, a: LatLng, b: LatLng): number {
  // Project into a local planar frame; fine at city/state scale.
  const latRef = toRad((a.lat + b.lat) / 2);
  const x = (p: LatLng) => toRad(p.lng) * Math.cos(latRef) * EARTH_RADIUS_KM;
  const y = (p: LatLng) => toRad(p.lat) * EARTH_RADIUS_KM;

  const px = x(point);
  const py = y(point);
  const ax = x(a);
  const ay = y(a);
  const bx = x(b);
  const by = y(b);

  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return haversineKm(point, a);

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const cx = ax + t * dx;
  const cy = ay + t * dy;

  return Math.hypot(px - cx, py - cy);
}
