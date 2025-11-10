
// routes.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserInsights } from './data/users';
import { getAllShipments, getShipmentById, createShipment } from './data/shipments';
import { getStatusHistoryByShipmentId } from './data/statusHistory';
import { escalateShipment } from './data/escalations';

const authRouter = express.Router();
const shipmentsRouter = express.Router();
const usersRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

shipmentsRouter.use(authenticate);

shipmentsRouter.get('/', async (req, res) => {
  try {
    const shipments = await getAllShipments();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

shipmentsRouter.post('/', async (req, res) => {
  try {
    const { trackingNumber, carrier, createdBy } = req.body;
    const shipment = await createShipment(trackingNumber, carrier, createdBy);
    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

shipmentsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await getShipmentById(Number(id));
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

shipmentsRouter.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await getStatusHistoryByShipmentId(Number(id));
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch status history' });
  }
});

shipmentsRouter.post('/:id/escalate', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const escalation = await escalateShipment(Number(id), reason);
    res.status(201).json(escalation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to escalate shipment' });
  }
});

usersRouter.use(authenticate);

usersRouter.get('/:id/insights', async (req, res) => {
  try {
    const { id } = req.params;
    const insights = await getUserInsights(Number(id));
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user insights' });
  }
});

export { authRouter, shipmentsRouter, usersRouter };
