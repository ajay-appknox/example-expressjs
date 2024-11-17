const express = require("express");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const traceRoutes = require("./routes/trace");
const jwtRoutes = require("./routes/jwt");
const bypass403Routes = require("./routes/bypass_403")
const app = express();
const port = 8200;

app.use(express.json());

app.use(authRoutes);
app.use(usersRoutes);
app.use(traceRoutes);
app.use(jwtRoutes);
app.use(bypass403Routes);

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
