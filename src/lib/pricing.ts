import { DOMESTIC_TARIFF, PLATFORM_FEE_PCT, SERVICE_TAX_PCT } from './config';

/**
 * The single pricing engine.
 *
 * Every rupee shown anywhere — booking summary, receipt, host earnings, admin revenue —
 * comes from here. Duplicating this arithmetic in a component is how a checkout total
 * and a receipt end up disagreeing.
 */

export type PriceBreakdown = {
  /** kWh the session is billed for. */
  units: number;
  pricePerKwh: number;
  /** What the electricity itself is worth to the rider. */
  energyCost: number;
  /** ChargeSetu commission. */
  platformFee: number;
  /** GST on the service fee only — electricity is not our supply. */
  tax: number;
  /** What the rider pays. */
  total: number;
  /** What the host receives before their own electricity cost. */
  hostPayout: number;
  /** The host's own electricity cost at domestic tariff. */
  hostElectricityCost: number;
  /** What the host actually keeps. */
  hostNet: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculatePrice(units: number, pricePerKwh: number): PriceBreakdown {
  const safeUnits = Math.max(0, units);
  const energyCost = round2(safeUnits * pricePerKwh);
  const platformFee = round2(energyCost * PLATFORM_FEE_PCT);
  const tax = round2(platformFee * SERVICE_TAX_PCT);

  const total = round2(energyCost + platformFee + tax);
  const hostPayout = round2(energyCost);
  const hostElectricityCost = round2(safeUnits * DOMESTIC_TARIFF);

  return {
    units: round2(safeUnits),
    pricePerKwh,
    energyCost,
    platformFee,
    tax,
    total,
    hostPayout,
    hostElectricityCost,
    hostNet: round2(hostPayout - hostElectricityCost),
  };
}

/** Aggregate a set of completed sessions into one earnings view. */
export function summariseEarnings(sessions: { units: number; pricePerKwh: number }[]) {
  return sessions.reduce(
    (acc, s) => {
      const p = calculatePrice(s.units, s.pricePerKwh);
      return {
        sessions: acc.sessions + 1,
        units: round2(acc.units + p.units),
        gross: round2(acc.gross + p.energyCost),
        platformFee: round2(acc.platformFee + p.platformFee),
        electricity: round2(acc.electricity + p.hostElectricityCost),
        net: round2(acc.net + p.hostNet),
      };
    },
    { sessions: 0, units: 0, gross: 0, platformFee: 0, electricity: 0, net: 0 }
  );
}

/** Booking references shown to users: CS-IND-2026-000123 */
export function formatBookingId(seq: number, city = 'IND', year = 2026): string {
  return `CS-${city}-${year}-${String(seq).padStart(6, '0')}`;
}
