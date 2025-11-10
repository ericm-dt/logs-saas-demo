
// data/shipments.ts
import { db } from '../db';

export const getAllShipments = async () => {
  const result = await db.query('SELECT * FROM shipments');
  return result.rows;
};

export const getShipmentById = async (id: number) => {
  const result = await db.query('SELECT * FROM shipments WHERE id = $1', [id]);
  return result.rows[0];
};

export const createShipment = async (trackingNumber: string, carrier: string, createdBy: number) => {
  const result = await db.query(
    'INSERT INTO shipments (tracking_number, carrier, created_by) VALUES ($1, $2, $3) RETURNING *',
    [trackingNumber, carrier, createdBy]
  );
  return result.rows[0];
};
