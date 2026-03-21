import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import path from "path";
import connectDb from "./src/lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/lib/inngest.js";
import { protectRoute } from "./src/middleware/protectRoute.js";
import chatRoutes from "./src/routes/chat.routes.js";
import sessionRoutes from "./src/routes/session.routes.js";

const app = express();

// const __dirname = path.resolve();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL,"http://localhost:2000"],
    credentials: true,
  }),
);
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// Proxy for piston API to bypass CORS
app.post("/api/piston/execute", async (req, res) => {
  try {
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/user", protectRoute, (req, res) => {
  res.json({ message: "Hello World!" });
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
