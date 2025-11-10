
// data/escalations.ts
import { db } from '../db';

export const escalateShipment = async (shipmentId: number, reason: string) => {
  const result = await db.query(
    'INSERT INTO escalations (shipment_id, reason) VALUES ($1, $2) RETURNING *',
    [shipmentId, reason]
  );
  return result.rows[0];
};
