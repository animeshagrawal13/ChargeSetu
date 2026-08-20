import { Charger, Vehicle } from '@/domain/types';

/**
 * Dwell-time matching.
 *
 * The insight this encodes: for a two-wheeler, the binding constraint is almost never the
 * socket's speed — it is how long the rider is standing still. A 0.7 kW socket at the office
 * delivers more over a four-hour shift than a 3.3 kW socket during a twenty-minute errand.
 * So once the rider tells us their dwell window, ranking by raw power is wrong and ranking
 * by "how much of the charge I need can this actually deliver" is right.
 */

/** Riders top up to 80%, matching the booking estimator. */
export const TARGET_STATE_OF_CHARGE = 0.8;

export type DwellOption = { hours: number; label: string; hint: string };

export const DWELL_OPTIONS: DwellOption[] = [
  { hours: 1, label: '~1 hour', hint: 'Errand, chai stop' },
  { hours: 2, label: '~2 hours', hint: 'Lunch, a film' },
  { hours: 4, label: '~4 hours', hint: 'Class, half shift' },
  { hours: 8, label: '8+ hours', hint: 'Work day or overnight' },
];

/** Power actually flowing: the lower of what the socket offers and what the vehicle draws. */
export function effectiveKw(
  charger: Pick<Charger, 'powerKw'>,
  vehicle: Pick<Vehicle, 'onboardChargerKw'>
): number {
  return Math.min(charger.powerKw, vehicle.onboardChargerKw);
}

/** kWh the rider is after — a top-up to 80%, not a full pack. */
export function neededKwh(vehicle: Pick<Vehicle, 'batteryKwh'>): number {
  return vehicle.batteryKwh * TARGET_STATE_OF_CHARGE;
}

/**
 * How well a charger fits a dwell window.
 *
 * `fit` is the share of the needed charge delivered, capped at 1 — a socket that could
 * deliver twice what you need is no better than one that exactly covers it, because you
 * are leaving at the same time either way.
 */
export function dwellFit(
  charger: Pick<Charger, 'powerKw'>,
  vehicle: Pick<Vehicle, 'onboardChargerKw' | 'batteryKwh'> | null,
  dwellHours: number | null
): { fit: number; deliverableKwh: number } {
  if (!vehicle || dwellHours === null) return { fit: 1, deliverableKwh: 0 };

  const deliverableKwh = effectiveKw(charger, vehicle) * dwellHours;
  const needed = neededKwh(vehicle);
  if (needed <= 0) return { fit: 1, deliverableKwh };

  return { fit: Math.min(1, deliverableKwh / needed), deliverableKwh };
}

/** Hours to deliver the needed top-up at this socket. */
export function hoursToTopUp(
  charger: Pick<Charger, 'powerKw'>,
  vehicle: Pick<Vehicle, 'onboardChargerKw' | 'batteryKwh'>
): number {
  const kw = effectiveKw(charger, vehicle);
  return kw > 0 ? neededKwh(vehicle) / kw : Infinity;
}

/** Short human label for the fit badge. */
export function fitLabel(fit: number): string {
  if (fit >= 0.99) return 'Full top-up in this time';
  if (fit >= 0.6) return `${Math.round(fit * 100)}% of your top-up`;
  if (fit >= 0.2) return `Partial — ${Math.round(fit * 100)}% only`;
  return 'Too slow for this stop';
}
