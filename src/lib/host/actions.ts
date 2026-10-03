'use server';

import { db } from '@/lib/db';
import { bookingsTable, usersTable, safetyReportsTable } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

// --- Earnings ---
export async function getHostEarningsAction() {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: 'Unauthorized', data: [] };

  try {
    const completedBookings = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.hostId, session.userId),
          eq(bookingsTable.status, 'completed')
        )
      );

    return { ok: true, data: completedBookings };
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return { ok: false, error: 'Failed to fetch earnings', data: [] };
  }
}

// --- KYC ---
export async function submitKycAction(kycData: any) {
  const session = await getSession();
  if (!session?.userId) return { ok: false, error: 'Unauthorized' };

  try {
    const updatedKyc = {
      ...kycData,
      status: 'submitted',
      submittedAt: Date.now(),
    };

    await db
      .update(usersTable)
      .set({ kyc: updatedKyc })
      .where(eq(usersTable.id, session.userId));

    return { ok: true };
  } catch (error) {
    console.error('Error submitting KYC:', error);
    return { ok: false, error: 'Failed to submit KYC' };
  }
}

// --- Safety ---
export async function submitSafetyReportAction(category: string, details: string) {
  const session = await getSession();
  const userId = session?.userId || null;

  try {
    const reportId = `sf_${crypto.randomUUID().replace(/-/g, '')}`;
    await db.insert(safetyReportsTable).values({
      id: reportId,
      userId,
      category,
      details,
      status: 'pending',
    });

    return { ok: true };
  } catch (error) {
    console.error('Error submitting safety report:', error);
    return { ok: false, error: 'Failed to submit report' };
  }
}
