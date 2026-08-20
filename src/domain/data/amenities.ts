import { AmenityId } from '@/domain/types';

/** Icon names are from @expo/vector-icons MaterialCommunityIcons. */
export const AMENITIES: { id: AmenityId; label: string; icon: string }[] = [
  { id: 'ELECTRICITY_SOCKET', label: 'Electricity Socket', icon: 'power-socket-de' },
  { id: 'COVERED_PARKING', label: 'Covered Parking', icon: 'garage-variant' },
  { id: 'CCTV', label: 'CCTV Monitoring', icon: 'cctv' },
  { id: 'DRINKING_WATER', label: 'Drinking Water', icon: 'cup-water' },
  { id: 'TEA_COFFEE', label: 'Tea/Coffee', icon: 'coffee' },
  { id: 'WAITING_AREA', label: 'Waiting Area', icon: 'sofa-single' },
  { id: 'MOBILE_CHARGER', label: 'Mobile Charger', icon: 'cellphone-charging' },
  { id: 'FIRST_AID', label: 'First Aid Kit', icon: 'medical-bag' },
  { id: 'NEARBY_CAFE', label: 'Nearby Cafe', icon: 'silverware-fork-knife' },
  { id: 'PET_FRIENDLY', label: 'Pet Friendly', icon: 'dog-side' },
  { id: 'READING_MATERIAL', label: 'Reading Material', icon: 'book-open-variant' },
  { id: 'WASHROOM', label: 'Washroom', icon: 'toilet' },
  { id: 'WIFI', label: 'Wi-Fi', icon: 'wifi' },
  { id: 'SECURITY_GUARD', label: 'Security Guard', icon: 'shield-account' },
];

export const AMENITY_BY_ID = Object.fromEntries(AMENITIES.map((a) => [a.id, a])) as Record<
  AmenityId,
  (typeof AMENITIES)[number]
>;
