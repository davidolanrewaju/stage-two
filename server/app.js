import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import homeRoutes from './routes/homeRoutes.js';
import userRoutes from './routes/userRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import organisationRoutes from './routes/organisationRoutes.js'



const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/', homeRoutes);

export default app;