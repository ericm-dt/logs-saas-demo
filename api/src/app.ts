// app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { authRouter, shipmentsRouter, usersRouter } from './routes';
import { setupSwagger } from './swagger';
import cron from 'node-cron';
import { purgeOldData } from './cleanup';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

setupSwagger(app);

app.use('/auth', authRouter);
app.use('/shipments', shipmentsRouter);
app.use('/users', usersRouter);

app.get('/health', (req, res) => {
  res.send('ShipTrackr API is running');
});

cron.schedule('0 * * * *', purgeOldData);

app.listen(PORT, () => {
  console.log(`ShipTrackr API listening on port ${PORT}`);
});
