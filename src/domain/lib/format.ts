/**
 * Display rules, applied everywhere: distances in km to 2 decimals, money as ₹x.xx,
 * power as x.x kW.
 */

export const formatKm = (km: number) => `${km.toFixed(2)} km`;

export const formatMoney = (rupees: number) => `₹${rupees.toFixed(2)}`;

export const formatKw = (kw: number) => `${kw.toFixed(1)} kW`;

export const formatRate = (pricePerKwh: number) => `${formatMoney(pricePerKwh)}/kWh`;

export const formatKwh = (kwh: number) => `${kwh.toFixed(2)} kWh`;

/** "1h 25m" — used for session duration and estimates. */
export function formatDuration(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "2.5 h" for the full-charge estimate, which the spec rounds to the half hour. */
export const formatHours = (hours: number) => `${hours.toFixed(1)} h`;
