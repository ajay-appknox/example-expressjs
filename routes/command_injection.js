const express = require("express");
const { exec } = require("child_process");

const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.text({ type: "text/plain" }));

function execCommand(command, timeout) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}

function getErrorOutput(error) {
  const output = `${error.stdout || ""}${error.stderr || ""}`;
  return output || error.message;
}

function parseTextParams(body) {
  const params = {};

  for (const line of body.split("\n")) {
    if (!line.includes("=")) {
      continue;
    }

    const [key, ...rest] = line.split("=");
    const value = rest.join("=");
    params[key.trim()] = value.trim();
  }

  return params;
}

router.get("/output/search", async (req, res) => {
  const query = req.query.q || "";
  const command = `grep -r '${query}' /tmp/search_data 2>&1`;

  try {
    const { stdout } = await execCommand(command, 5000);
    res.json({ status: "success", results: stdout.slice(0, 500) });
  } catch (error) {
    res.status(500).json({ status: "error", error: getErrorOutput(error) });
  }
});

router.get("/output/ping", async (req, res) => {
  const host = req.query.host || "localhost";
  const command = `ping -c 1 ${host} 2>&1`;

  try {
    const { stdout } = await execCommand(command, 10000);
    res.json({ status: "success", output: stdout });
  } catch (error) {
    res.status(500).json({ status: "error", output: getErrorOutput(error) });
  }
});

router.get("/output/param", async (req, res) => {
  const name = req.query.name || "";
  const cmd = req.query.cmd || "";
  const command = `echo Name: ${name} Cmd: ${cmd} 2>&1`;

  try {
    const { stdout } = await execCommand(command, 5000);
    res.status(200).json({ status: "success", output: stdout });
  } catch (error) {
    res.status(500).json({ status: "error", output: getErrorOutput(error) });
  }
});

router.post("/output/api/user", async (req, res) => {
  const username = (req.body && req.body.username) || "";
  const command = `echo 'Creating user: ${username}' >> /tmp/users.log 2>&1`;

  try {
    await execCommand(command, 5000);
    res.status(201).json({ status: "success", message: "User created" });
  } catch (error) {
    res.status(500).json({ status: "error", error: getErrorOutput(error) });
  }
});

router.post("/output/api/login", async (req, res) => {
  const username = req.body.username || "";
  const command = `grep '${username}' /tmp/passwd 2>&1`;

  try {
    await execCommand(command, 5000);
    res.status(200).json({ status: "success", message: "Login successful" });
  } catch (error) {
    res.status(401).json({ status: "error", error: getErrorOutput(error) });
  }
});

router.post("/output/api/process", async (req, res) => {
  const text = typeof req.body === "string" ? req.body : "";
  const params = parseTextParams(text);
  const commandParam = params.command || text.trim();
  const command = `echo Processing: ${commandParam} 2>&1`;

  try {
    const { stdout } = await execCommand(command, 5000);
    res.status(200).json({ status: "success", output: stdout });
  } catch (error) {
    res.status(500).json({ status: "error", error: getErrorOutput(error) });
  }
});

router.post("/output/api/graphql", async (req, res) => {
  const data = req.body || {};
  const query = data.query || "";
  const variables = typeof data.variables === "object" ? JSON.stringify(data.variables) : String(data.variables || "");
  const command = `echo GraphQL ${query} ${variables} 2>&1`;

  try {
    const { stdout } = await execCommand(command, 5000);
    res.status(200).json({ status: "success", output: stdout });
  } catch (error) {
    res.status(500).json({ status: "error", error: getErrorOutput(error) });
  }
});

router.get("/time/dns", async (req, res) => {
  const domain = req.query.domain || "example.com";
  const command = `nslookup ${domain} 2>&1`;
  const start = Date.now();

  try {
    await execCommand(command, 15000);
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    res.json({ status: "success", time: `${elapsed}s` });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

router.get("/time/health-check", async (req, res) => {
  const service = req.query.service || "default";
  const command = `echo Checking ${service} > /dev/null 2>&1`;

  try {
    await execCommand(command, 10000);
  } catch (error) {
    // Intentionally ignore execution errors to preserve blind behavior.
  }

  res.status(200).json({ status: "ok" });
});

router.get("/time/validate", async (req, res) => {
  const email = req.query.email || "";
  const command = `echo ${email} | grep "@" > /dev/null 2>&1`;

  try {
    await execCommand(command, 10000);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(200).json({ valid: false });
  }
});

router.post("/time/api/validate", async (req, res) => {
  const data = req.body || {};
  const value = data.data || "";
  const command = `echo Val ${value} > /dev/null 2>&1`;

  try {
    await execCommand(command, 15000);
  } catch (error) {
    // Intentionally ignore execution errors to preserve blind behavior.
  }

  res.status(200).json({ status: "validated" });
});

router.post("/time/api/text", async (req, res) => {
  const text = typeof req.body === "string" ? req.body : "";
  const params = parseTextParams(text);
  const commandParam = params.command || text.trim();
  const command = `echo ${commandParam} > /dev/null 2>&1`;
  const start = Date.now();

  try {
    await execCommand(command, 15000);
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    res.status(200).json({ status: "success", time: `${elapsed}s` });
  } catch (error) {
    res.status(200).json({ status: "success", time: "0.00s" });
  }
});

router.post("/time/api/graphql", async (req, res) => {
  const data = req.body || {};
  const query = data.query || "";
  const variables = typeof data.variables === "object" ? JSON.stringify(data.variables) : String(data.variables || "");
  const command = `echo ${query} ${variables} > /dev/null 2>&1`;
  const start = Date.now();

  try {
    await execCommand(command, 15000);
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    res.status(200).json({ status: "success", time: `${elapsed}s` });
  } catch (error) {
    res.status(200).json({ status: "success", time: "0.00s" });
  }
});

module.exports = router;
