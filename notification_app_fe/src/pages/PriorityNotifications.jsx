import { useEffect, useMemo, useState } from "react";
import { Container, Typography, Alert, Stack, Box, Button, Chip } from "@mui/material";
import FilterBar from "../components/FilterBar";
import NotificationCard from "../components/NotificationCard";
import Loader from "../components/Loader";
import { fetchNotifications } from "../services/api";
import { sendLog } from "../services/log";
import { priorityScore, sortByPriority } from "../utils/priorityHelper";

const FETCH_LIMIT = 100;

function getViewedIds() {
  const stored = localStorage.getItem("viewedNotifications");
  try {
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveViewedIds(viewed) {
  localStorage.setItem("viewedNotifications", JSON.stringify(viewed));
}

function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState("");
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState(getViewedIds);

  useEffect(() => {
    loadNotifications();
  }, [notificationType]);

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotifications({ notification_type: notificationType, limit: FETCH_LIMIT, page: 1 });
      const allNotifications = Array.isArray(data) ? data : data.notifications || [];
      setNotifications(allNotifications);
      sendLog("frontend", "info", "api", "Loaded notifications for priority inbox");
    } catch (err) {
      setError("Unable to load priority notifications. Please try again.");
      sendLog("frontend", "error", "api", "Failed to fetch priority notifications");
    } finally {
      setLoading(false);
    }
  }

  const priorityNotifications = useMemo(() => {
    const ordered = sortByPriority(notifications);
    return ordered.slice(0, topN);
  }, [notifications, topN]);

  const handleView = (id) => {
    const next = { ...viewedIds, [id]: true };
    setViewedIds(next);
    saveViewedIds(next);
    sendLog("frontend", "info", "interaction", `Marked notification ${id} as viewed`);
  };

  const unreadCount = useMemo(() => priorityNotifications.filter((notification) => !viewedIds[notification.ID]).length, [priorityNotifications, viewedIds]);

  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h4">Priority Inbox</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Top {topN} unread notifications ordered by priority and recency.
            </Typography>
          </Box>
          <Chip label={`${unreadCount} unread`} color={unreadCount === 0 ? "default" : "secondary"} />
        </Box>

        <FilterBar
          notificationType={notificationType}
          setNotificationType={setNotificationType}
          topN={topN}
          setTopN={setTopN}
          showTopSelector
        />

        {loading ? (
          <Loader message="Loading the priority inbox…" />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={2}>
            {priorityNotifications.length === 0 ? (
              <Alert severity="info">No priority notifications available for the selected filter.</Alert>
            ) : (
              priorityNotifications.map((notification) => (
                <NotificationCard
                  key={notification.ID || notification.id}
                  notification={notification}
                  viewed={Boolean(viewedIds[notification.ID || notification.id])}
                  onView={handleView}
                />
              ))
            )}
          </Stack>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
          <Button variant="outlined" onClick={loadNotifications}>
            Refresh priority list
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default PriorityNotifications;
