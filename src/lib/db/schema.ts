import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  index,
  smallint,
  serial,
} from 'drizzle-orm/pg-core';

/* ============================================================ users */
export const usersTable = pgTable('users', {
  id: text('id').primaryKey(), // uid prefix user_
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 10 }).notNull().default('rider'), // rider | host | both
  gender: varchar('gender', { length: 10 }),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  about: text('about'),
  vehicleNumber: varchar('vehicle_number', { length: 20 }),
  // vehicle info stored as JSON for flexibility
  vehicle: jsonb('vehicle').notNull().default('{}'),
  preferredSocket: varchar('preferred_socket', { length: 20 }).notNull().default('SOCKET_15A'),
  rating: real('rating').notNull().default(0),
  ratingsCount: integer('ratings_count').notNull().default(0),
  hostBadge: varchar('host_badge', { length: 20 }).notNull().default('Newbie'),
  onDuty: boolean('on_duty').notNull().default(false),
  // KYC info stored as JSON
  kyc: jsonb('kyc'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/* ============================================================ chargers */
export const chargersTable = pgTable(
  'chargers',
  {
    id: text('id').primaryKey(),
    hostId: text('host_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    hostName: varchar('host_name', { length: 120 }).notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    city: varchar('city', { length: 60 }).notNull().default('Indore'),
    addressLine: text('address_line').notNull(),
    landmark: text('landmark').notNull().default(''),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
    socketType: varchar('socket_type', { length: 20 }).notNull(), // SOCKET_5A | SOCKET_15A | OEM_FAST
    connectors: jsonb('connectors').notNull().default('[]'), // string[]
    powerKw: real('power_kw').notNull(),
    pricePerKwh: real('price_per_kwh').notNull(),
    amenities: jsonb('amenities').notNull().default('[]'), // AmenityId[]
    availability: jsonb('availability').notNull().default('[]'), // Availability[]
    photos: jsonb('photos').notNull().default('[]'), // string[]
    rating: real('rating').notNull().default(0),
    ratingsCount: integer('ratings_count').notNull().default(0),
    hostBadge: varchar('host_badge', { length: 20 }).notNull().default('Newbie'),
    hostGender: varchar('host_gender', { length: 10 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('chargers_host_idx').on(t.hostId), index('chargers_city_idx').on(t.city)]
);

/* ============================================================ bookings */
export const bookingsTable = pgTable(
  'bookings',
  {
    id: text('id').primaryKey(),
    seq: serial('seq'), // for formatted booking ID
    chargerId: text('charger_id')
      .notNull()
      .references(() => chargersTable.id),
    riderId: text('rider_id')
      .notNull()
      .references(() => usersTable.id),
    hostId: text('host_id')
      .notNull()
      .references(() => usersTable.id),
    slotStart: timestamp('slot_start', { withTimezone: true }).notNull(),
    slotEnd: timestamp('slot_end', { withTimezone: true }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('requested'),
    otp: varchar('otp', { length: 4 }).notNull().default(''),
    estimatedKwh: real('estimated_kwh').notNull().default(0),
    actualKwh: real('actual_kwh'),
    amount: real('amount'),
    riderRated: boolean('rider_rated').notNull().default(false),
    hostRated: boolean('host_rated').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('bookings_rider_idx').on(t.riderId),
    index('bookings_host_idx').on(t.hostId),
    index('bookings_charger_idx').on(t.chargerId),
    index('bookings_status_idx').on(t.status),
  ]
);

/* ============================================================ ratings */
export const ratingsTable = pgTable(
  'ratings',
  {
    id: text('id').primaryKey(),
    bookingId: text('booking_id')
      .notNull()
      .references(() => bookingsTable.id),
    fromUserId: text('from_user_id')
      .notNull()
      .references(() => usersTable.id),
    toUserId: text('to_user_id')
      .notNull()
      .references(() => usersTable.id),
    stars: smallint('stars').notNull(),
    comment: text('comment').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('ratings_booking_idx').on(t.bookingId),
    index('ratings_to_user_idx').on(t.toUserId),
  ]
);

/* ============================================================ safety_reports */
export const safetyReportsTable = pgTable('safety_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => usersTable.id),
  chargerId: text('charger_id').references(() => chargersTable.id),
  category: varchar('category', { length: 60 }).notNull(),
  details: text('details').notNull().default(''),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
