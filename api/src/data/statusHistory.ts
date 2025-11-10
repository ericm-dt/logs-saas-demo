
// data/statusHistory.ts
import { db } from '../db';

export const getStatusHistoryByShipmentId = async (shipmentId: number) => {
  const result = await db.query(
    'SELECT * FROM status_history WHERE shipment_id = $1 ORDER BY timestamp ASC',
    [shipmentId]
  );
  return result.rows;
};
