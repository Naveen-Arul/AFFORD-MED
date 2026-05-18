const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const Log = require("../logging-middleware");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const notificationRoutes = require("./routes/notificationRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/notifications", notificationRoutes);

app.get("/api/notifications", async (req, res) => {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    return res.status(401).json({ error: "Missing ACCESS_TOKEN" });
  }

  const params = new URLSearchParams();
  if (req.query.notification_type) params.append("notification_type", req.query.notification_type);
  if (req.query.limit) params.append("limit", req.query.limit);
  if (req.query.page) params.append("page", req.query.page);

  const externalUrl = `http://4.224.186.213/evaluation-service/notifications?${params.toString()}`;
  try {
    const response = await axios.get(externalUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
    Log("backend", "info", "proxy", `Fetched remote notifications ${externalUrl}`);
    return res.json(response.data);
  } catch (error) {
    Log("backend", "error", "proxy", `Remote notifications failed: ${error.message}`);
    return res.status(error.response?.status || 500).json({ error: error.message || "Proxy failure" });
  }
});

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
