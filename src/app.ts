import express, { Application } from 'express';
import cors from 'cors';
// import { UserRoutes } from './app/modules/User/user.route';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//application routes
// app.use('/api/users', UserRoutes);

export default app;
