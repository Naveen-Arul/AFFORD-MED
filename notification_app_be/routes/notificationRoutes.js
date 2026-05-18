const express = require("express");
const Log = require("../../logging-middleware");
const router = express.Router();

let notifications = [];

router.get("/", (req, res) => {
  Log("backend", "info", "notifications", "Fetched notifications");
  res.json(notifications);
});

router.post("/", (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    Log("backend", "warn", "notifications", "Invalid notification payload");
    return res.status(400).json({ error: "Title and message are required" });
  }

  const notification = { id: Date.now(), title, message };
  notifications.unshift(notification);
  Log("backend", "info", "notifications", `Created notification "${title}"`);

  res.json({ message: "Notification added", notification });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const beforeCount = notifications.length;
  notifications = notifications.filter((item) => item.id !== id);

  if (notifications.length === beforeCount) {
    Log("backend", "warn", "notifications", `Delete failed, id not found: ${id}`);
    return res.status(404).json({ error: "Notification not found" });
  }

  Log("backend", "info", "notifications", `Deleted notification id ${id}`);
  res.json({ message: "Notification deleted" });
});

module.exports = router;
