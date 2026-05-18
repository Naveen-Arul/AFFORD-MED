import axios from "axios";

const API_BASE = "http://4.224.186.213/evaluation-service";

export async function fetchNotifications({ notification_type, limit, page } = {}) {
  const response = await axios.get(`${API_BASE}/notifications`, {
    params: {
      notification_type,
      limit,
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_EVAL_TOKEN}`,
    },
    timeout: 10000,
  });

  return response.data.notifications || [];
}
