import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Yhteys toimii!" });
});

app.get("/api/data", (req, res) => {
  res.json({ message: "Data toimii!" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
