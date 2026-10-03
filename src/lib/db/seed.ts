import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { SEED_CHARGERS } from '../../domain/data/seedChargers';

dotenv.config({ path: '.env.local' });

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log('Seeding chargers...');
  
  try {
    for (const charger of SEED_CHARGERS) {
      // First ensure the dummy host user exists
      await db.insert(schema.usersTable).values({
        id: charger.hostId,
        name: charger.hostName,
        email: `${charger.hostName.toLowerCase()}@example.com`,
        phone: '9999999999',
        passwordHash: 'dummy',
        role: 'host',
      }).onConflictDoNothing();

      // Insert charger
      await db.insert(schema.chargersTable).values({
        id: charger.id,
        hostId: charger.hostId,
        hostName: charger.hostName,
        title: charger.title,
        city: charger.city,
        addressLine: charger.addressLine,
        landmark: charger.landmark,
        lat: charger.geo.lat,
        lng: charger.geo.lng,
        socketType: charger.socketType,
        connectors: charger.connectors,
        powerKw: charger.powerKw,
        pricePerKwh: charger.pricePerKwh,
        amenities: charger.amenities,
        availability: charger.availability,
        photos: charger.photos,
        rating: charger.rating,
        ratingsCount: charger.ratingsCount,
        hostBadge: charger.hostBadge,
        hostGender: charger.hostGender,
        isActive: charger.isActive,
      }).onConflictDoNothing();
    }
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

seed();
