import axios from "axios";

const API_BASE = "http://localhost:5000";

export async function sendLog(stack, level, packageName, message) {
  try {
    await axios.post(`${API_BASE}/log`, {
      stack,
      level,
      packageName,
      message,
    });
  } catch (err) {
    // Logging should not block the UI
    console.warn("Log request failed", err.message || err);
  }
}
