import { dwellFit, effectiveKw, hoursToTopUp, neededKwh } from './dwell';
import { Vehicle } from '@/domain/types';

const bike = (onboardChargerKw: number, batteryKwh = 3.7): Vehicle => ({
  brand: 'Test',
  model: 'Test',
  batteryKwh,
  onboardChargerKw,
  connector: 'PORTABLE_15A',
});

const socket5A = { powerKw: 0.7 };
const socket15A = { powerKw: 3.0 };

describe('effectiveKw()', () => {
  it('takes the lower of socket and onboard charger', () => {
    expect(effectiveKw(socket15A, bike(1.2))).toBeCloseTo(1.2);
    expect(effectiveKw(socket5A, bike(1.2))).toBeCloseTo(0.7);
  });
});

describe('neededKwh()', () => {
  it('targets an 80% top-up rather than a full pack', () => {
    expect(neededKwh(bike(1, 4))).toBeCloseTo(3.2);
  });
});

describe('dwellFit()', () => {
  it('returns a neutral fit when the rider has not said how long they will stay', () => {
    expect(dwellFit(socket5A, bike(1.2), null).fit).toBe(1);
  });

  it('returns a neutral fit when there is no vehicle yet', () => {
    expect(dwellFit(socket5A, null, 4).fit).toBe(1);
  });

  it('caps at 1 — delivering more than needed is not better', () => {
    // 3.0 kW for 8 h could deliver 24 kWh against a 2.96 kWh need.
    expect(dwellFit(socket15A, bike(3.0), 8).fit).toBe(1);
  });

  it('is the core claim: a slow socket over a long stay beats a fast one over a short stay', () => {
    const v = bike(3.0);
    const slowLongStay = dwellFit(socket5A, v, 8).fit;
    const fastShortStay = dwellFit(socket15A, v, 0.25).fit;
    expect(slowLongStay).toBeGreaterThan(fastShortStay);
  });

  it('scales linearly below the cap', () => {
    const v = bike(3.0, 10);
    const oneHour = dwellFit(socket15A, v, 1).fit;
    const twoHours = dwellFit(socket15A, v, 2).fit;
    expect(twoHours).toBeCloseTo(oneHour * 2, 5);
  });

  it('reports the kWh it could actually deliver', () => {
    expect(dwellFit(socket5A, bike(1.2), 4).deliverableKwh).toBeCloseTo(2.8);
  });
});

describe('hoursToTopUp()', () => {
  it('takes longer on a 5A socket than a 15A one', () => {
    const v = bike(3.0);
    expect(hoursToTopUp(socket5A, v)).toBeGreaterThan(hoursToTopUp(socket15A, v));
  });

  it('is infinite when no power can flow', () => {
    expect(hoursToTopUp({ powerKw: 0 }, bike(1.2))).toBe(Infinity);
  });
});
