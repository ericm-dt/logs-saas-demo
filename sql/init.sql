
-- Schema for ShipTrackr

-- Organizations
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);

-- Shipments
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    carrier VARCHAR(100) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Status History
CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Escalations
CREATE TABLE escalations (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    escalated_at TIMESTAMP DEFAULT NOW()
);
