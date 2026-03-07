import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";

const app = express();

// const __dirname = path.resolve();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
