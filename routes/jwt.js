const app = require("express");
const router = app.Router();
const jwt = require("jsonwebtoken");

function verifyToken(token) {
  try {
    var result = jwt.verify(token, "secret", { algorithm: "HS256" });
    return result;
  } catch (err) {
    return null;
  }
}

function verifyTokenInsecure(token) {
  try {
    return jwt.decode(token, undefined, { algorithm: ["none"] });
  } catch (err) {
    console.log(err);
  }
  return null;
}

router.get("/api/jwt/protected", (req, res) => {
  console.log(req.url);
  const token = req.headers.authorization;

  if (token == undefined) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const payload = verifyToken(token);
    if (payload) {
      res.json({ message: "This is a protected route", user: payload.name });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/api/jwt/insecure", (req, res) => {
  console.log(req.url);
  var token = req.headers.authorization;
  if (token.indexOf(" ") > -1) {
    token = token.split(" ")[1];
  }

  if (token == undefined) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const payload = verifyTokenInsecure(token);
    res.json({ message: "This is a protected route", user: payload.name });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
