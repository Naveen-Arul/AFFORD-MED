const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const Log = require("../logging-middleware");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const notificationRoutes = require("./routes/notificationRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/notifications", notificationRoutes);

app.post("/log", async (req, res) => {
  const { stack, level, packageName, message } = req.body;
  await Log(stack, level, packageName, message);
  res.json({ status: "logged" });
});

app.use((err, req, res, next) => {
  Log("backend", "error", "server", err.message || "Unexpected error");
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
