// models.ts

export interface Organization {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  organizationId: number;
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  carrier: string;
  createdBy: number;
}

export interface StatusUpdate {
  id: number;
  shipmentId: number;
  timestamp: string; // ISO 8601 format
  location: string;
  status: string;
}

export interface Escalation {
  id: number;
  shipmentId: number;
  reason: string;
  escalatedAt?: string; // ISO 8601 format
}

export interface UserInsights {
  totalShipments: number;
  delayedShipments: number;
  averageDeliveryTime: number;
  topCarrier: string;
}