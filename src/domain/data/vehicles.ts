import { Vehicle } from '@/domain/types';

/**
 * Editable catalogue of Indian electric two-wheelers.
 *
 * Battery and onboard-charger figures are approximate and marked `// verify` — confirm
 * against each OEM's spec sheet before the demo.
 *
 * Connector policy: riders normally carry their own portable charger, so almost every
 * model defaults to PORTABLE_5A / PORTABLE_15A and works with any household socket.
 * Only mark `OEM_*` where the team has confirmed the brand sells a proprietary *home*
 * fast charger. The three marked below are the ones to double-check.
 */
export const VEHICLES: Vehicle[] = [
  // Ola Electric — sells a proprietary home fast charger alongside the portable unit.
  { brand: 'Ola Electric', model: 'S1 Pro', batteryKwh: 4.0, onboardChargerKw: 0.75, connector: 'OEM_OLA' }, // verify
  { brand: 'Ola Electric', model: 'S1 Air', batteryKwh: 3.0, onboardChargerKw: 0.75, connector: 'OEM_OLA' }, // verify
  { brand: 'Ola Electric', model: 'S1 X (2 kWh)', batteryKwh: 2.0, onboardChargerKw: 0.5, connector: 'PORTABLE_5A' }, // verify
  { brand: 'Ola Electric', model: 'S1 X (4 kWh)', batteryKwh: 4.0, onboardChargerKw: 0.75, connector: 'PORTABLE_15A' }, // verify

  // Ather — the Ather home dock is a proprietary wall unit.
  { brand: 'Ather', model: '450X', batteryKwh: 3.7, onboardChargerKw: 0.7, connector: 'OEM_ATHER' }, // verify
  { brand: 'Ather', model: '450S', batteryKwh: 2.9, onboardChargerKw: 0.7, connector: 'OEM_ATHER' }, // verify
  { brand: 'Ather', model: 'Rizta S', batteryKwh: 2.9, onboardChargerKw: 0.7, connector: 'OEM_ATHER' }, // verify
  { brand: 'Ather', model: 'Rizta Z', batteryKwh: 3.7, onboardChargerKw: 0.7, connector: 'OEM_ATHER' }, // verify

  // TVS
  { brand: 'TVS', model: 'iQube', batteryKwh: 3.4, onboardChargerKw: 0.95, connector: 'PORTABLE_15A' }, // verify
  { brand: 'TVS', model: 'iQube (5.1 kWh)', batteryKwh: 5.1, onboardChargerKw: 0.95, connector: 'PORTABLE_15A' }, // verify
  { brand: 'TVS', model: 'iQube ST', batteryKwh: 5.1, onboardChargerKw: 1.5, connector: 'PORTABLE_15A' }, // verify
  { brand: 'TVS', model: 'Orbiter', batteryKwh: 3.1, onboardChargerKw: 0.65, connector: 'PORTABLE_5A' }, // verify
  { brand: 'TVS', model: 'X', batteryKwh: 4.4, onboardChargerKw: 1.5, connector: 'PORTABLE_15A' }, // verify

  // Bajaj
  { brand: 'Bajaj', model: 'Chetak 3001', batteryKwh: 3.0, onboardChargerKw: 0.8, connector: 'PORTABLE_15A' }, // verify
  { brand: 'Bajaj', model: 'Chetak 3501', batteryKwh: 3.5, onboardChargerKw: 1.3, connector: 'PORTABLE_15A' }, // verify

  // Hero Vida
  { brand: 'Hero Vida', model: 'V2 Plus', batteryKwh: 3.94, onboardChargerKw: 1.2, connector: 'PORTABLE_15A' }, // verify
  { brand: 'Hero Vida', model: 'VX2 Go', batteryKwh: 2.2, onboardChargerKw: 0.6, connector: 'PORTABLE_5A' }, // verify
  { brand: 'Hero Vida', model: 'VX2 Plus', batteryKwh: 3.4, onboardChargerKw: 1.2, connector: 'PORTABLE_15A' }, // verify

  // River
  { brand: 'River', model: 'Indie', batteryKwh: 4.0, onboardChargerKw: 1.0, connector: 'PORTABLE_15A' }, // verify

  // Ampere
  { brand: 'Ampere', model: 'Nexus', batteryKwh: 3.0, onboardChargerKw: 0.75, connector: 'PORTABLE_15A' }, // verify

  // Bgauss
  { brand: 'Bgauss', model: 'RUV350', batteryKwh: 3.0, onboardChargerKw: 0.75, connector: 'PORTABLE_15A' }, // verify

  // Simple Energy
  { brand: 'Simple Energy', model: 'One', batteryKwh: 5.0, onboardChargerKw: 1.3, connector: 'PORTABLE_15A' }, // verify

  // Revolt
  { brand: 'Revolt', model: 'RV400', batteryKwh: 3.24, onboardChargerKw: 1.0, connector: 'PORTABLE_15A' }, // verify

  // Ultraviolette — big packs, sold with a proprietary boost charger.
  { brand: 'Ultraviolette', model: 'F77', batteryKwh: 7.1, onboardChargerKw: 1.3, connector: 'OEM_ULTRAVIOLETTE' }, // verify
  { brand: 'Ultraviolette', model: 'F77 Recon', batteryKwh: 10.3, onboardChargerKw: 1.3, connector: 'OEM_ULTRAVIOLETTE' }, // verify
];

/** Fallback for riders whose vehicle is not listed — assumed to carry a 15A portable charger. */
export const OTHER_BRAND = 'Other / not listed';

export const makeOtherVehicle = (model: string): Vehicle => ({
  brand: OTHER_BRAND,
  model: model.trim() || 'Unlisted model',
  batteryKwh: 3.0,
  onboardChargerKw: 0.75,
  connector: 'PORTABLE_15A',
});

export const BRANDS: string[] = [...new Set(VEHICLES.map((v) => v.brand)), OTHER_BRAND];

export const modelsForBrand = (brand: string): Vehicle[] =>
  VEHICLES.filter((v) => v.brand === brand);
