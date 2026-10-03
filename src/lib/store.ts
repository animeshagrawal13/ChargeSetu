'use client';

import type { Booking, BookingStatus, Charger, Rating, User } from '@/domain/types';

/* ------------------------------------------------------------------ keys */
const K = {
  users: 'cs_users',
  chargers: 'cs_chargers',
  bookings: 'cs_bookings',
  ratings: 'cs_ratings',
  session: 'cs_session',
  seeded: 'cs_seeded',
} as const;

/* ------------------------------------------------------------------ low-level helpers */
function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function isSeeded(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(K.seeded) === '1';
}

export function markSeeded(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(K.seeded, '1');
}

/* ------------------------------------------------------------------ uid */
let counter = Date.now();
export function uid(prefix = ''): string {
  return `${prefix}${(++counter).toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ------------------------------------------------------------------ session */
export function getSessionUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(K.session);
}

export function setSession(userId: string): void {
  localStorage.setItem(K.session, userId);
}

export function clearSession(): void {
  localStorage.removeItem(K.session);
}

/* ------------------------------------------------------------------ users */
export function getUsers(): User[] {
  return read<User>(K.users);
}

export function getUser(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getUserByPhone(phone: string): User | undefined {
  return getUsers().find((u) => u.phone === phone);
}

export function createUser(user: User & { password?: string }): User {
  const users = getUsers();
  // Store password separately so the User type stays clean
  const passwords = readPasswords();
  if (user.password) {
    passwords[user.id] = user.password;
    writePasswords(passwords);
  }
  const { password: _, ...cleanUser } = user;
  users.push(cleanUser as User);
  write(K.users, users);
  return cleanUser as User;
}

export function updateUser(id: string, patch: Partial<User>): User | undefined {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...patch };
  write(K.users, users);
  return users[idx];
}

function readPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('cs_passwords') ?? '{}');
  } catch {
    return {};
  }
}

function writePasswords(p: Record<string, string>): void {
  localStorage.setItem('cs_passwords', JSON.stringify(p));
}

export function checkPassword(userId: string, password: string): boolean {
  return readPasswords()[userId] === password;
}

/* ------------------------------------------------------------------ chargers */
export function getChargers(): Charger[] {
  return read<Charger>(K.chargers);
}

export function getActiveChargers(): Charger[] {
  return getChargers().filter((c) => c.isActive);
}

export function getCharger(id: string): Charger | undefined {
  return getChargers().find((c) => c.id === id);
}

export function getChargersByHost(hostId: string): Charger[] {
  return getChargers().filter((c) => c.hostId === hostId);
}

export function createCharger(charger: Charger): Charger {
  const chargers = getChargers();
  chargers.push(charger);
  write(K.chargers, chargers);
  return charger;
}

export function updateCharger(id: string, patch: Partial<Charger>): Charger | undefined {
  const chargers = getChargers();
  const idx = chargers.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  chargers[idx] = { ...chargers[idx], ...patch };
  write(K.chargers, chargers);
  return chargers[idx];
}

export function seedChargers(chargers: Charger[]): void {
  write(K.chargers, chargers);
}

/* ------------------------------------------------------------------ bookings */
export function getBookings(): Booking[] {
  return read<Booking>(K.bookings);
}

export function getBooking(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

export function getBookingsByRider(riderId: string): Booking[] {
  return getBookings().filter((b) => b.riderId === riderId);
}

export function getBookingsByHost(hostId: string): Booking[] {
  return getBookings().filter((b) => b.hostId === hostId);
}

export function createBooking(booking: Booking): Booking {
  const bookings = getBookings();
  bookings.push(booking);
  write(K.bookings, bookings);
  return booking;
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | undefined {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  bookings[idx] = { ...bookings[idx], ...patch };
  write(K.bookings, bookings);
  return bookings[idx];
}

/** Transition a booking's status with validation of the legal state transitions. */
export function transitionBooking(
  id: string,
  newStatus: BookingStatus,
  extra?: Partial<Booking>
): Booking | undefined {
  const booking = getBooking(id);
  if (!booking) return undefined;

  const allowed: Record<BookingStatus, BookingStatus[]> = {
    requested: ['accepted', 'rejected', 'cancelled'],
    accepted: ['active', 'cancelled'],
    active: ['completed'],
    completed: [],
    rejected: [],
    cancelled: [],
  };

  if (!allowed[booking.status].includes(newStatus)) return undefined;

  return updateBooking(id, { ...extra, status: newStatus, updatedAt: Date.now() });
}

/* ------------------------------------------------------------------ ratings */
export function getRatings(): Rating[] {
  return read<Rating>(K.ratings);
}

export function getRatingsByBooking(bookingId: string): Rating[] {
  return getRatings().filter((r) => r.bookingId === bookingId);
}

export function getRatingsForUser(userId: string): Rating[] {
  return getRatings().filter((r) => r.toUserId === userId);
}

export function createRating(rating: Rating): Rating {
  const ratings = getRatings();
  ratings.push(rating);
  write(K.ratings, ratings);

  // Update the target user's average rating
  const userRatings = getRatingsForUser(rating.toUserId);
  const avg = userRatings.reduce((sum, r) => sum + r.stars, 0) / userRatings.length;
  updateUser(rating.toUserId, { rating: Math.round(avg * 10) / 10, ratingsCount: userRatings.length });

  return rating;
}

export function hasRated(bookingId: string, fromUserId: string): boolean {
  return getRatings().some((r) => r.bookingId === bookingId && r.fromUserId === fromUserId);
}

/* ------------------------------------------------------------------ OTP */
export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/* ------------------------------------------------------------------ reset */
export function resetAll(): void {
  Object.values(K).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem('cs_passwords');
}
