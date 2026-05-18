import { useEffect, useMemo, useState } from "react";
import { Container, Typography, Alert, Stack, Pagination, Button, Chip, Box } from "@mui/material";
import FilterBar from "../components/FilterBar";
import NotificationCard from "../components/NotificationCard";
import Loader from "../components/Loader";
import { fetchNotifications } from "../services/api";
import { sendLog } from "../services/log";

const PAGE_LIMIT = 10;

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

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewedIds, setViewedIds] = useState(getViewedIds);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationType, page]);

  async function loadNotifications() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotifications({ notification_type: notificationType, limit: PAGE_LIMIT, page });
      const allNotifications = Array.isArray(data) ? data : data.notifications || [];
      setNotifications(allNotifications);
      setTotalPages(Math.max(1, Math.ceil((data.total || allNotifications.length) / PAGE_LIMIT)));
      sendLog("frontend", "info", "api", "Loaded notifications list");
    } catch (err) {
      setError("Unable to load notifications. Please try again.");
      sendLog("frontend", "error", "api", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }

  const handleView = (id) => {
    const next = { ...viewedIds, [id]: true };
    setViewedIds(next);
    saveViewedIds(next);
    sendLog("frontend", "info", "interaction", `Marked notification ${id} as viewed`);
  };

  const unreadCount = useMemo(() => notifications.filter((notification) => !viewedIds[notification.ID]).length, [notifications, viewedIds]);

  return (
    <Container sx={{ py: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h4">All Notifications</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Browse the latest notifications with filter and pagination support.
            </Typography>
          </Box>
          <Chip label={`${unreadCount} new`} color={unreadCount === 0 ? "default" : "primary"} />
        </Box>

        <FilterBar notificationType={notificationType} setNotificationType={(value) => { setNotificationType(value); setPage(1); }} />

        {loading ? (
          <Loader />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={2}>
            {notifications.length === 0 ? (
              <Alert severity="info">No notifications matched your filters.</Alert>
            ) : (
              notifications.map((notification) => (
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

        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
          <Button variant="contained" onClick={() => setPage((current) => current + 1)} disabled={page === totalPages || totalPages === 1}>
            Next
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

export default AllNotifications;
