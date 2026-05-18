import { useEffect, useState } from "react";
import NotificationForm from "../components/NotificationForm";
import NotificationList from "../components/NotificationList";
import { fetchNotifications, createNotification, removeNotification } from "../services/api";
import { sendLog } from "../services/log";

function Home() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchNotifications();
      setNotifications(data);
      sendLog("frontend", "info", "page", "Loaded notifications");
    } catch (err) {
      setError("Unable to load notifications");
      sendLog("frontend", "error", "api", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleAdd = async (notification) => {
    try {
      await createNotification(notification);
      await loadNotifications();
      sendLog("frontend", "info", "component", "Notification form submitted");
    } catch (err) {
      setError("Unable to add notification");
      sendLog("frontend", "error", "api", "Failed to add notification");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeNotification(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      sendLog("frontend", "info", "component", `Deleted notification id ${id}`);
    } catch (err) {
      setError("Unable to delete notification");
      sendLog("frontend", "error", "api", "Failed to delete notification");
    }
  };

  return (
    <div className="page-shell">
      <div className="panel">
        <header className="panel-header">
          <h1>Notification Dashboard</h1>
          <p>Manage alerts with a simple frontend-first flow.</p>
        </header>

        <NotificationForm onAdd={handleAdd} />

        {error && <div className="status status-error">{error}</div>}

        {loading ? (
          <div className="status">Loading notifications…</div>
        ) : (
          <NotificationList notifications={notifications} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default Home;
