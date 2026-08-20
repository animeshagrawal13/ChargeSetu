import { compatible, fullChargeHours, getCompatibility, impliedSocket, usableKw } from './compatibility';
import { Charger, Vehicle } from '@/domain/types';

const charger = (
  socketType: Charger['socketType'],
  connectors: Charger['connectors'] = []
): Pick<Charger, 'socketType' | 'connectors'> => ({ socketType, connectors });

const vehicle = (connector: Vehicle['connector'], onboardChargerKw = 0.75, batteryKwh = 3): Vehicle => ({
  brand: 'Test',
  model: 'Test',
  batteryKwh,
  onboardChargerKw,
  connector,
});

describe('compatible()', () => {
  it('accepts any vehicle on a 5A household socket', () => {
    expect(compatible(charger('SOCKET_5A'), vehicle('PORTABLE_5A'))).toBe(true);
    expect(compatible(charger('SOCKET_5A'), vehicle('OEM_ATHER'))).toBe(true);
  });

  it('accepts any vehicle on a 15A household socket', () => {
    expect(compatible(charger('SOCKET_15A'), vehicle('PORTABLE_15A'))).toBe(true);
    expect(compatible(charger('SOCKET_15A'), vehicle('OEM_OLA'))).toBe(true);
  });

  it('only accepts a matching connector on an OEM fast charger', () => {
    const ola = charger('OEM_FAST', ['OEM_OLA']);
    expect(compatible(ola, vehicle('OEM_OLA'))).toBe(true);
    expect(compatible(ola, vehicle('OEM_ATHER'))).toBe(false);
    expect(compatible(ola, vehicle('PORTABLE_15A'))).toBe(false);
  });

  it('matches when an OEM charger lists several connectors', () => {
    const multi = charger('OEM_FAST', ['OEM_ULTRAVIOLETTE', 'OEM_OLA']);
    expect(compatible(multi, vehicle('OEM_OLA'))).toBe(true);
  });
});

describe('getCompatibility()', () => {
  it('flags a 5A socket as slow when the vehicle can draw more than it supplies', () => {
    expect(getCompatibility(charger('SOCKET_5A'), vehicle('PORTABLE_15A', 1.3))).toBe(
      'SLOW_BUT_WORKS'
    );
  });

  it('is plainly compatible when the vehicle draws no more than 0.7 kW', () => {
    expect(getCompatibility(charger('SOCKET_5A'), vehicle('PORTABLE_5A', 0.7))).toBe('COMPATIBLE');
  });

  it('never reports slow for a 15A socket', () => {
    expect(getCompatibility(charger('SOCKET_15A'), vehicle('PORTABLE_15A', 1.5))).toBe('COMPATIBLE');
  });

  it('reports not compatible for a mismatched OEM connector', () => {
    expect(getCompatibility(charger('OEM_FAST', ['OEM_OLA']), vehicle('OEM_ATHER'))).toBe(
      'NOT_COMPATIBLE'
    );
  });
});

describe('usableKw()', () => {
  it('is capped by the socket, not the vehicle', () => {
    expect(usableKw('SOCKET_5A', vehicle('PORTABLE_15A', 3.3))).toBeCloseTo(0.7);
  });

  it('is capped by the vehicle when the socket is the larger of the two', () => {
    expect(usableKw('OEM_FAST', vehicle('OEM_OLA', 1.3))).toBeCloseTo(1.3);
  });
});

describe('fullChargeHours()', () => {
  it('rounds to the nearest half hour', () => {
    // 3.0 kWh at 0.7 kW = 4.28 h -> 4.5
    expect(fullChargeHours('SOCKET_5A', vehicle('PORTABLE_5A', 0.7, 3))).toBe(4.5);
  });

  it('gets faster on a socket that can supply more', () => {
    const v = vehicle('PORTABLE_15A', 3.0, 3);
    expect(fullChargeHours('SOCKET_15A', v)).toBeLessThan(fullChargeHours('SOCKET_5A', v));
  });
});

describe('impliedSocket()', () => {
  it('maps connectors to the socket the rider most likely needs', () => {
    expect(impliedSocket(vehicle('PORTABLE_5A'))).toBe('SOCKET_5A');
    expect(impliedSocket(vehicle('PORTABLE_15A'))).toBe('SOCKET_15A');
    expect(impliedSocket(vehicle('OEM_ATHER'))).toBe('OEM_FAST');
  });
});
