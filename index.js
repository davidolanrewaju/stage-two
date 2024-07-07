// server.js
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authRoutes from "./server/routes/authRoutes.js";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "Welcome!",
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});