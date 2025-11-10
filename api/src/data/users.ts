
// data/users.ts
import { db } from '../db';

export const getUserInsights = async (userId: number) => {
  const result = await db.query(
    `SELECT
      COUNT(*) AS total_shipments,
      COUNT(*) FILTER (WHERE s.id IN (
        SELECT shipment_id FROM status_history WHERE status = 'delayed'
      )) AS delayed_shipments,
      AVG(EXTRACT(EPOCH FROM MAX(sh.timestamp) - MIN(sh.timestamp)) / 3600) AS average_delivery_time,
      (SELECT carrier FROM shipments WHERE created_by = $1 GROUP BY carrier ORDER BY COUNT(*) DESC LIMIT 1) AS top_carrier
    FROM shipments s
    JOIN status_history sh ON s.id = sh.shipment_id
    WHERE s.created_by = $1`,
    [userId]
  );
  return result.rows[0];
};
