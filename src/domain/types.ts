/**
 * Indian electric two-wheelers charge from household AC sockets at 230 V.
 * The variable is current rating (amperes), never voltage. Nothing here is "5V".
 */
export type SocketType = 'SOCKET_5A' | 'SOCKET_15A' | 'OEM_FAST';

export type Connector = 'PORTABLE_5A' | 'PORTABLE_15A' | `OEM_${string}`;

export type TimeSlotId = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export type AmenityId =
  | 'ELECTRICITY_SOCKET'
  | 'COVERED_PARKING'
  | 'CCTV'
  | 'DRINKING_WATER'
  | 'TEA_COFFEE'
  | 'WAITING_AREA'
  | 'MOBILE_CHARGER'
  | 'FIRST_AID'
  | 'NEARBY_CAFE'
  | 'PET_FRIENDLY'
  | 'READING_MATERIAL'
  | 'WASHROOM'
  | 'WIFI'
  | 'SECURITY_GUARD';

export type HostBadge = 'Newbie' | 'Trusted' | 'Super Host';

export type Vehicle = {
  brand: string;
  model: string;
  batteryKwh: number;
  onboardChargerKw: number;
  connector: Connector;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  about?: string;
  /** Registration plate, collected on the Set EV Details step. */
  vehicleNumber?: string;
  vehicle: Vehicle;
  gender?: Gender;
  dateOfBirth?: string;
  /** Host verification. Riders do not need it; hosts do before a listing goes live. */
  kyc?: HostKyc;
  /** Host availability toggle, mirrored on the earnings screen. */
  onDuty?: boolean;
  preferredSocket: SocketType;
  role: 'rider' | 'host' | 'both';
  rating: number;
  ratingsCount: number;
  hostBadge: HostBadge;
  createdAt: number;
};

export type Availability = { day: 0 | 1 | 2 | 3 | 4 | 5 | 6; slots: TimeSlotId[] };

export type Charger = {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  city: string;
  addressLine: string;
  landmark: string;
  geo: { lat: number; lng: number };
  socketType: SocketType;
  /** Only meaningful when socketType === 'OEM_FAST'. */
  connectors: Connector[];
  powerKw: number;
  /** ₹ per unit (kWh). */
  pricePerKwh: number;
  amenities: AmenityId[];
  availability: Availability[];
  photos: string[];
  rating: number;
  ratingsCount: number;
  hostBadge: HostBadge;
  /** Copied from the host at publish time so the women-hosts filter can run offline. */
  hostGender?: Gender;
  isActive: boolean;
  createdAt: number;
};

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'rejected'
  | 'active'
  | 'completed'
  | 'cancelled';

export type Booking = {
  id: string;
  chargerId: string;
  riderId: string;
  hostId: string;
  slotStart: number;
  slotEnd: number;
  status: BookingStatus;
  /** 4-digit, generated when the host accepts. */
  otp: string;
  estimatedKwh: number;
  actualKwh: number | null;
  amount: number | null;
  createdAt: number;
  updatedAt: number;
};

export type Rating = {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment: string;
  createdAt: number;
};

/** Result of matching a charger against the rider's vehicle. */
export type Compatibility = 'COMPATIBLE' | 'SLOW_BUT_WORKS' | 'NOT_COMPATIBLE';

export type Gender = 'male' | 'female' | 'other';

export type KycDocStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type KycDocId =
  | 'PROPERTY'
  | 'IDENTITY'
  | 'PHOTO'
  | 'ADDRESS'
  | 'ELECTRICITY';

/**
 * Host verification state.
 *
 * PROTOTYPE NOTE: no real identity document is ever stored. We keep only the last four
 * digits the user typed, purely so the review screen can show a masked reference. Nothing
 * is transmitted anywhere — there is no verification partner wired up.
 */
export type HostKyc = {
  status: KycDocStatus;
  docs: Record<KycDocId, KycDocStatus>;
  /** 'aadhaar' | 'pan' — which ID the host chose to present. */
  idType?: 'aadhaar' | 'pan';
  /** Last 4 characters only. Never the full number. */
  idLast4?: string;
  /** Local file URI of the selfie, on-device only. */
  selfieUri?: string;
  propertyOwnership?: 'owner' | 'tenant';
  electricityConsumerNo?: string;
  submittedAt?: number;
};
