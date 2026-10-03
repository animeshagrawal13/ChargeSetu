'use server';

import { db } from '@/lib/db';
import { usersTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSession, clearSession, getSession } from './session';
import { uid } from '@/lib/store'; // reusing the uid generator for now, or just use crypto.randomUUID()
import type { Vehicle } from '@/domain/types';

export async function loginAction(email: string, password: string) {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    
    if (!user) {
      return { ok: false, error: 'No account with that email.' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { ok: false, error: 'Incorrect password.' };
    }

    await createSession(user.id);
    
    return { ok: true, user };
  } catch (err) {
    console.error('Login error:', err);
    return { ok: false, error: 'An unexpected error occurred.' };
  }
}

export async function signupAction(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'rider' | 'host' | 'both';
  vehicle?: Vehicle;
}) {
  try {
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, data.email)).limit(1);
    if (existing) {
      return { ok: false, error: 'Email already registered.' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const userId = `user_${crypto.randomUUID().replace(/-/g, '')}`;

    const defaultVehicle: Vehicle = data.vehicle ?? {
      brand: 'Other / not listed',
      model: 'Unlisted model',
      batteryKwh: 3.0,
      onboardChargerKw: 0.75,
      connector: 'PORTABLE_15A',
    };

    const [newUser] = await db.insert(usersTable).values({
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
      vehicle: defaultVehicle,
      preferredSocket: 'SOCKET_15A',
      rating: 0,
      ratingsCount: 0,
      hostBadge: 'Newbie',
    }).returning();

    await createSession(newUser.id);

    return { ok: true, user: newUser };
  } catch (err) {
    console.error('Signup error:', err);
    return { ok: false, error: 'An unexpected error occurred.' };
  }
}

export async function logoutAction() {
  await clearSession();
}

export async function getCurrentUserAction() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
    return user || null;
  } catch (err) {
    return null;
  }
}

export async function updateUserAction(patch: Partial<typeof usersTable.$inferInsert>) {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const [updatedUser] = await db
      .update(usersTable)
      .set(patch)
      .where(eq(usersTable.id, session.userId))
      .returning();
    return updatedUser;
  } catch (err) {
    console.error('Update user error:', err);
    return null;
  }
}
