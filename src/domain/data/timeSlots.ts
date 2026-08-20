import { TimeSlotId } from '@/domain/types';

/**
 * NIGHT wraps past midnight (21:00 → 06:00), so endHour < startHour for that slot.
 * Anything computing a concrete window from these must handle the wrap.
 */
export const TIME_SLOTS: {
  id: TimeSlotId;
  label: string;
  range: string;
  startHour: number;
  endHour: number;
  icon: string;
}[] = [
  { id: 'MORNING', label: 'Morning', range: '6 AM–12 PM', startHour: 6, endHour: 12, icon: 'white-balance-sunny' },
  { id: 'AFTERNOON', label: 'Afternoon', range: '12 PM–6 PM', startHour: 12, endHour: 18, icon: 'weather-partly-cloudy' },
  { id: 'EVENING', label: 'Evening', range: '6 PM–9 PM', startHour: 18, endHour: 21, icon: 'weather-night' },
  { id: 'NIGHT', label: 'Night', range: '9 PM–6 AM', startHour: 21, endHour: 6, icon: 'moon-waning-crescent' },
];

export const SLOT_BY_ID = Object.fromEntries(TIME_SLOTS.map((s) => [s.id, s])) as Record<
  TimeSlotId,
  (typeof TIME_SLOTS)[number]
>;

export const ALL_SLOT_IDS: TimeSlotId[] = TIME_SLOTS.map((s) => s.id);

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
