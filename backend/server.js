import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import translateRoutes from "./routes/translate.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/translate", translateRoutes);

app.get("/", (req, res) => {
  res.send("Servidor del traductor funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});