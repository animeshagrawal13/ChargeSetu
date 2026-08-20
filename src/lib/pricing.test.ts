import { calculatePrice, formatBookingId, summariseEarnings } from './pricing';
import { DOMESTIC_TARIFF, PLATFORM_FEE_PCT, SERVICE_TAX_PCT } from './config';

describe('calculatePrice()', () => {
  it('bills units at the host rate', () => {
    expect(calculatePrice(3, 10).energyCost).toBe(30);
  });

  it('takes the platform fee off the energy cost, not the total', () => {
    const p = calculatePrice(3, 10);
    expect(p.platformFee).toBeCloseTo(30 * PLATFORM_FEE_PCT, 2);
  });

  it('taxes the service fee only — electricity is not our supply', () => {
    const p = calculatePrice(3, 10);
    expect(p.tax).toBeCloseTo(p.platformFee * SERVICE_TAX_PCT, 2);
  });

  it('totals to energy plus fee plus tax, with nothing hidden', () => {
    const p = calculatePrice(3, 10);
    expect(p.total).toBeCloseTo(p.energyCost + p.platformFee + p.tax, 2);
  });

  it('leaves the host their margin over domestic tariff', () => {
    const p = calculatePrice(3, 10);
    expect(p.hostElectricityCost).toBeCloseTo(3 * DOMESTIC_TARIFF, 2);
    expect(p.hostNet).toBeCloseTo(p.hostPayout - p.hostElectricityCost, 2);
  });

  it('leaves the host out of pocket when they price below tariff', () => {
    // Pricing at ₹5 against a ₹7 tariff should read as a loss, not be clamped to zero.
    expect(calculatePrice(2, 5).hostNet).toBeLessThan(0);
  });

  it('never returns negative units', () => {
    expect(calculatePrice(-5, 10).units).toBe(0);
    expect(calculatePrice(-5, 10).total).toBe(0);
  });

  it('rounds to paise so the receipt and the total agree', () => {
    const p = calculatePrice(2.847, 9.5);
    expect(p.total).toBeCloseTo(Number(p.total.toFixed(2)), 10);
  });
});

describe('summariseEarnings()', () => {
  it('is empty for no sessions', () => {
    expect(summariseEarnings([])).toEqual({
      sessions: 0,
      units: 0,
      gross: 0,
      platformFee: 0,
      electricity: 0,
      net: 0,
    });
  });

  it('adds up to the same answer as pricing each session', () => {
    const sessions = [
      { units: 3, pricePerKwh: 10 },
      { units: 2, pricePerKwh: 9 },
    ];
    const s = summariseEarnings(sessions);
    const each = sessions.map((x) => calculatePrice(x.units, x.pricePerKwh));

    expect(s.sessions).toBe(2);
    expect(s.gross).toBeCloseTo(each[0].energyCost + each[1].energyCost, 2);
    expect(s.net).toBeCloseTo(each[0].hostNet + each[1].hostNet, 2);
  });
});

describe('formatBookingId()', () => {
  it('pads to the documented shape', () => {
    expect(formatBookingId(123)).toBe('CS-IND-2026-000123');
  });
});
