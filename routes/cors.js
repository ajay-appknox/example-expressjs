const app = require("express");
const router = app.Router();

router.get("/cors/regular", (req, res) => {
  res.status(200).send("Welcome to CORS Server!");
});

router.get("/cors/wildcard", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.query.methods) {
    res.set("Access-Control-Allow-Methods", "POST");
  }
  res.status(200).send("Wildcard");
});

router.get("/cors/reflected", (req, res) => {
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

router.get("/cors/null", (req, res) => {
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

router.get("/cors/regex", (req, res) => {
  const origin = req.get("Origin");
  if (origin.startsWith("cors.com") || origin.endsWith("cors.com")) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  if (req.query.methods) {
    res.set("Access-Control-Allow-Methods", "POST");
  }
  if (req.query.auth) {
    res.set("Access-Control-Allow-Credentials", "true");
  }
  res.status(200).send("Regex");
});

router.get("/cors/all_checks", (req, res) => {
  const origin = req.get("Origin");
  res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Credentials", "true");
  res.status(200).send("All checks");
});

// All checks case-insensitive route
router.get("/cors/all_checks_ci", (req, res) => {
  const origin = req.get("Origin");
  res.set("access-control-allow-origin", origin);
  res.set("Access-Control-Allow-Methods", "post");
  res.set("access-control-allow-credentials", "true");
  res.status(200).send("All checks");
});

module.exports = router;
