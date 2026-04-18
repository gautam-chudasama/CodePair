import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import connectDb from "./src/lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./src/lib/inngest.js";
import { protectRoute } from "./src/middleware/protectRoute.js";
import chatRoutes from "./src/routes/chat.routes.js";
import sessionRoutes from "./src/routes/session.routes.js";
import { execFile } from "child_process";
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:2000",
      "https://code-pair-git-bugfixes-gautam-chudasamas-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// Code execution engine
// Priority: 1) Local Piston Docker  2) Direct child_process  3) Wandbox API (Python only)

const TEMP_DIR = join(process.cwd(), ".tmp-exec");
if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

// Generic executor using child_process
function executeWithProcess(command, args, code, ext) {
  return new Promise((resolve) => {
    const filename = join(TEMP_DIR, `exec_${Date.now()}.${ext}`);
    try {
      writeFileSync(filename, code, "utf8");
      execFile(
        command,
        [...args, filename],
        { timeout: 10000, maxBuffer: 1024 * 512 },
        (error, stdout, stderr) => {
          try {
            unlinkSync(filename);
          } catch {}
          if (error && error.killed) {
            return resolve({
              run: {
                output: "",
                stderr: "Execution timed out (10s limit)",
                code: 1,
              },
            });
          }
          if (error) {
            if (error.code === "ENOENT" || error.message.includes("ENOENT")) {
               return Promise.reject(error); // Reject so fallback works
            }
            return resolve({
              run: {
                output: stdout || "",
                stderr: stderr || error.message,
                code: 1,
              },
            });
          }
          resolve({ run: { output: stdout, stderr: stderr || "", code: 0 } });
        },
      );
    } catch (err) {
      try {
        unlinkSync(filename);
      } catch {}
      if (err.code === "ENOENT" || err.message.includes("ENOENT")) {
         return Promise.reject(err);
      }
      resolve({ run: { output: "", stderr: err.message, code: 1 } });
    }
  });
}

// Java needs compile + run
function executeJava(code) {
  return new Promise((resolve) => {
    const filename = join(TEMP_DIR, `Solution.java`);
    try {
      writeFileSync(filename, code, "utf8");
      // Compile
      execFile(
        "javac",
        [filename],
        { timeout: 15000, cwd: TEMP_DIR },
        (compErr, compOut, compStderr) => {
          if (compErr) {
            try {
              unlinkSync(filename);
            } catch {}
            if (compErr.code === "ENOENT" || compErr.message.includes("ENOENT")) {
               return resolve(null); // Return null so we can fallback
            }
            return resolve({
              run: {
                output: "",
                stderr: compStderr || compErr.message,
                code: 1,
              },
              compile: { stderr: compStderr || compErr.message },
            });
          }
          // Run
          execFile(
            "java",
            ["-cp", TEMP_DIR, "Solution"],
            { timeout: 10000, maxBuffer: 1024 * 512 },
            (error, stdout, stderr) => {
              // Cleanup
              try {
                unlinkSync(filename);
              } catch {}
              try {
                unlinkSync(join(TEMP_DIR, "Solution.class"));
              } catch {}
              if (error && error.killed) {
                return resolve({
                  run: {
                    output: "",
                    stderr: "Execution timed out (10s limit)",
                    code: 1,
                  },
                });
              }
              if (error) {
                return resolve({
                  run: {
                    output: stdout || "",
                    stderr: stderr || error.message,
                    code: 1,
                  },
                });
              }
              resolve({
                run: { output: stdout, stderr: stderr || "", code: 0 },
              });
            },
          );
        },
      );
    } catch (err) {
      try {
        unlinkSync(filename);
      } catch {}
      if (err.code === "ENOENT" || err.message.includes("ENOENT")) {
         return resolve(null);
      }
      resolve({ run: { output: "", stderr: err.message, code: 1 } });
    }
  });
}

// Wandbox API fallback for all languages
async function executeViaWandbox(code, language) {
  let compiler = "cpython-3.10.15";
  if (language === "java") compiler = "openjdk-jdk-22+36";
  if (language === "javascript") compiler = "nodejs-20.17.0";

  try {
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler,
        code,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      run: {
        output: data.program_output || "",
        stderr: data.program_error || data.compiler_error || "",
        code: parseInt(data.status || "0"),
      },
      compile: {
        stderr: data.compiler_error || ""
      }
    };
  } catch {
    return null;
  }
}

app.post("/api/piston/execute", async (req, res) => {
  const { language, version, files } = req.body;
  const code = files?.[0]?.content;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // 1) Try local Piston Docker first
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3 sec timeout for local check
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
  } catch {}

  // 2) Direct execution via child_process
  try {
    let result;
    if (language === "javascript") {
      result = await executeWithProcess("node", [], code, "js");
    } else if (language === "python") {
      // Try python3 first, then python
      try {
        result = await executeWithProcess("python3", [], code, "py");
      } catch {
        result = await executeWithProcess("python", [], code, "py");
      }
    } else if (language === "java") {
      result = await executeJava(code);
    }

    if (result) {
      return res.json(result);
    }
  } catch (err) {
    console.error("Local execution error:", err.message);
  }

  // 3) Final Fallback to Wandbox API
  console.log("Falling back to Wandbox API for", language);
  const wandboxResult = await executeViaWandbox(code, language);
  if (wandboxResult) {
    return res.json(wandboxResult);
  }

  return res.status(500).json({
    error: `Cannot execute ${language}. Install ${language === "java" ? "JDK" : language} locally, or start the Piston Docker container.`,
  });
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
