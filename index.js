// server.js
import dotenv from "dotenv";
import app from "./server/app.js";

dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});