import axios from "axios";

const API_BASE = "http://localhost:5000";

export async function fetchNotifications() {
  const response = await axios.get(`${API_BASE}/notifications`);
  return response.data;
}

export async function createNotification(notification) {
  const response = await axios.post(`${API_BASE}/notifications`, notification);
  return response.data;
}

export async function removeNotification(id) {
  const response = await axios.delete(`${API_BASE}/notifications/${id}`);
  return response.data;
}
