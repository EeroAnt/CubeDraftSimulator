import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


// Serve static files from React
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, '/dist')));

app.get("/api/data", async (req, res) => {
  console.log("Fetching data from:", process.env.DATA_URL);

  try {
    const response = await fetch(process.env.DATA_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname + '/dist/index.html'));
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
