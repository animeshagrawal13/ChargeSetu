/**
 * Platform commission taken from each completed session, before host payout.
 * Configurable rather than hardcoded — never inline this number in a component.
 */
export const PLATFORM_FEE_PCT = Number(process.env.PLATFORM_FEE_PCT ?? 0.12);

/** Typical domestic electricity tariff in ₹/kWh, used to show a host their true margin. */
export const DOMESTIC_TARIFF = 7;

/** GST on the platform service fee only, not on the electricity component. */
export const SERVICE_TAX_PCT = 0.18;

export const DEFAULT_CITY = 'Indore';

export const INDORE_CENTRE = { lat: 22.7196, lng: 75.8577 } as const;

/** No Maps key in the environment means the demo map abstraction takes over. */
export const HAS_MAPS_KEY = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

/**
 * Everything in this build runs on seeded data. Surfaces that show numbers must say so
 * rather than implying live telemetry or real transactions.
 */
export const IS_DEMO = true;
