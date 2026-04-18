// Piston API is a service for code execution

const PISTON_API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api"}/piston`;

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    if (!code || code.trim().length === 0) {
      return {
        success: false,
        error: "No code to execute. Write some code first!",
      };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: language === "java" ? "Solution.java" : `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        success: false,
        error: `Execution service error (${response.status}): ${text || "Unknown error"}`,
      };
    }

    const data = await response.json();

    if (!data || !data.run) {
      return {
        success: false,
        error: "Invalid response from execution service",
      };
    }

    const output = data.run.output || "";
    const stderr = data.run.stderr || "";
    const exitCode = data.run.code;

    // If there's stderr or non-zero exit code, treat as error
    if (stderr && exitCode !== 0) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    // Compile errors
    if (data.compile && data.compile.stderr) {
      return {
        success: false,
        error: data.compile.stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Cannot connect to code execution service. Make sure the backend server is running.",
      };
    }
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}
