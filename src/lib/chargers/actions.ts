'use server';

import { db } from '@/lib/db';
import { chargersTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function getChargersAction() {
  try {
    const chargers = await db.select().from(chargersTable).where(eq(chargersTable.isActive, true));
    return chargers;
  } catch (error) {
    console.error('Error fetching chargers:', error);
    return [];
  }
}

export async function getChargerByIdAction(id: string) {
  try {
    const [charger] = await db.select().from(chargersTable).where(eq(chargersTable.id, id)).limit(1);
    return charger || null;
  } catch (error) {
    console.error('Error fetching charger:', error);
    return null;
  }
}

export async function createChargerAction(data: any) {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: 'Unauthorized' };

  try {
    const chargerId = `chg_${crypto.randomUUID().replace(/-/g, '')}`;
    const [charger] = await db.insert(chargersTable).values({
      ...data,
      id: chargerId,
      hostId: session.userId,
    }).returning();
    
    return { ok: true, charger };
  } catch (error) {
    console.error('Error creating charger:', error);
    return { ok: false, error: 'Failed to create charger' };
  }
}
