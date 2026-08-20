import { SOCKET_5A_KW, SOCKETS } from '@/domain/data/sockets';
import { Charger, Compatibility, SocketType, Vehicle } from '@/domain/types';

/**
 * Brand-first UX, derived constraint.
 *
 * The onboarding asks for brand and model because that is fast and familiar, but the
 * constraint is computed from the vehicle's charger and connector — it is not invented
 * from the brand. Riders carry a portable charger, so any household socket works; the
 * brand only matters for the OEM_FAST case.
 */
export function compatible(
  charger: Pick<Charger, 'socketType' | 'connectors'>,
  vehicle: Pick<Vehicle, 'connector'>
): boolean {
  switch (charger.socketType) {
    case 'SOCKET_5A':
      return true; // slow, but works
    case 'SOCKET_15A':
      return true;
    case 'OEM_FAST':
      return charger.connectors.includes(vehicle.connector);
  }
}

/**
 * Three-way badge state. "Slow but works" is a 5A socket paired with a vehicle whose
 * onboard charger can draw more than the socket can deliver.
 */
export function getCompatibility(
  charger: Pick<Charger, 'socketType' | 'connectors'>,
  vehicle: Pick<Vehicle, 'connector' | 'onboardChargerKw'>
): Compatibility {
  if (!compatible(charger, vehicle)) return 'NOT_COMPATIBLE';
  if (charger.socketType === 'SOCKET_5A' && vehicle.onboardChargerKw > SOCKET_5A_KW) {
    return 'SLOW_BUT_WORKS';
  }
  return 'COMPATIBLE';
}

export const COMPATIBILITY_LABEL: Record<Compatibility, string> = {
  COMPATIBLE: 'Compatible',
  SLOW_BUT_WORKS: 'Slow but works',
  NOT_COMPATIBLE: 'Not compatible',
};

/** Power actually delivered: the lower of what the socket offers and what the vehicle draws. */
export function usableKw(socketType: SocketType, vehicle: Pick<Vehicle, 'onboardChargerKw'>): number {
  return Math.min(SOCKETS[socketType].usableKw, vehicle.onboardChargerKw);
}

/** Hours to fill the pack on this socket, rounded to the nearest half hour. */
export function fullChargeHours(
  socketType: SocketType,
  vehicle: Pick<Vehicle, 'batteryKwh' | 'onboardChargerKw'>
): number {
  const kw = usableKw(socketType, vehicle);
  if (kw <= 0) return 0;
  return Math.round((vehicle.batteryKwh / kw) * 2) / 2;
}

/** The socket type a vehicle implies, used to preselect step 3 of onboarding. */
export function impliedSocket(vehicle: Pick<Vehicle, 'connector'>): SocketType {
  if (vehicle.connector.startsWith('OEM_')) return 'OEM_FAST';
  if (vehicle.connector === 'PORTABLE_5A') return 'SOCKET_5A';
  return 'SOCKET_15A';
}
