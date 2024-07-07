import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";


const app = express();

app.use(cookieParser);
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
    res.send("Welcome!")
});

export default app;