import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());
app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(3001, () => console.log("Flatmate Backend is ready for operations"));
