const app = require("express");
const router = app.Router();

router.get("/api/cors/regular", (req, res) => {
  res.status(200).send("Welcome to CORS Server!");
});

router.get("/api/cors/wildcard", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.query.methods) {
    res.set("Access-Control-Allow-Methods", "POST");
  }
  res.status(200).send("Wildcard");
});

router.get("/api/cors/reflected", (req, res) => {
  const origin = req.get("Origin");
  if (origin === "appknox.com") {
    res.set("Access-Control-Allow-Origin", origin);
  }

  if (req.query.methods) {
    res.set("Access-Control-Allow-Methods", "POST");
  }

  if (req.query.auth) {
    res.set("Access-Control-Allow-Credentials", "true");
  }
  res.status(200).send("Reflected");
});

router.get("/api/cors/null", (req, res) => {
  const origin = req.get("Origin");
  if (origin === "null") {
    res.set("Access-Control-Allow-Origin", "null");
  }
  if (req.query.methods) {
    res.set("Access-Control-Allow-Methods", "POST");
  }
  if (req.query.auth) {
    res.set("Access-Control-Allow-Credentials", "true");
  }
  res.status(200).send("Null");
});

router.get("/api/cors/regex", (req, res) => {
  const host = req.get("Host");
  const origin = req.get("Origin");
  console.log("Origin: " + origin + " | Host:" + host);
  if (origin.startsWith(host) || origin.endsWith(host)) {
    res.set("Access-Control-Allow-Origin", origin);
    console.log("Valid regex found");
  }
  if (req.query.methods) {
    res.set("Access-Control-Allow-Methods", "POST");
  }
  if (req.query.auth) {
    res.set("Access-Control-Allow-Credentials", "true");
  }
  res.status(200).send("Regex");
});

router.get("/api/cors/all_checks", (req, res) => {
  const origin = req.get("Origin");
  res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Credentials", "true");
  res.status(200).send("All checks");
});

// All checks case-insensitive route
router.get("/api/cors/all_checks_ci", (req, res) => {
  const origin = req.get("Origin");
  res.set("access-control-allow-origin", origin);
  res.set("Access-Control-Allow-Methods", "post");
  res.set("access-control-allow-credentials", "true");
  res.status(200).send("All checks");
});

module.exports = router;
