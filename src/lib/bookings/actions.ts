'use server';

import { db } from '@/lib/db';
import { bookingsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function createBookingAction(data: {
  chargerId: string;
  hostId: string;
  riderId: string;
  slotStart: number;
  slotEnd: number;
  estimatedKwh: number;
}) {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: 'Unauthorized' };

  try {
    const bookingId = `book_${crypto.randomUUID().replace(/-/g, '')}`;
    
    const [booking] = await db.insert(bookingsTable).values({
      id: bookingId,
      chargerId: data.chargerId,
      hostId: data.hostId,
      riderId: session.userId,
      slotStart: new Date(data.slotStart),
      slotEnd: new Date(data.slotEnd),
      estimatedKwh: data.estimatedKwh,
      status: 'requested',
    }).returning();

    return { ok: true, booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { ok: false, error: 'Failed to create booking' };
  }
}

export async function getBookingsAction() {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: 'Unauthorized', data: [] };

  try {
    // Return bookings where user is either host or rider
    // To do this simply, fetch all for now and filter, or use OR clause
    const asRider = await db.select().from(bookingsTable).where(eq(bookingsTable.riderId, session.userId));
    const asHost = await db.select().from(bookingsTable).where(eq(bookingsTable.hostId, session.userId));
    
    // Deduplicate just in case rider is booking their own charger
    const all = [...asRider, ...asHost];
    const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
    
    return { ok: true, data: unique };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { ok: false, error: 'Failed to fetch bookings', data: [] };
  }
}

export async function getBookingByIdAction(id: string) {
  try {
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
    return { ok: true, data: booking || null };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return { ok: false, error: 'Failed to fetch booking', data: null };
  }
}

export async function updateBookingStatusAction(id: string, status: string, otp?: string) {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: 'Unauthorized' };

  try {
    let updateData: any = { status, updatedAt: new Date() };
    if (status === 'accepted') {
      updateData.otp = String(Math.floor(1000 + Math.random() * 9000));
    }

    const [updated] = await db.update(bookingsTable)
      .set(updateData)
      .where(eq(bookingsTable.id, id))
      .returning();
      
    return { ok: true, data: updated };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { ok: false, error: 'Failed to update booking' };
  }
}

export async function completeBookingAction(id: string, actualKwh: number, amount: number) {
  try {
    const [updated] = await db.update(bookingsTable)
      .set({ 
        status: 'completed', 
        actualKwh, 
        amount,
        updatedAt: new Date() 
      })
      .where(eq(bookingsTable.id, id))
      .returning();
      
    return { ok: true, data: updated };
  } catch (error) {
    return { ok: false, error: 'Failed to complete booking' };
  }
}
