import { Card, CardContent, Chip, Typography, Stack, Button } from "@mui/material";

function NotificationCard({ notification, viewed, onView }) {
  const label = notification.Type || notification.type || "Unknown";
  const isUnread = !viewed;

  return (
    <Card variant="outlined" sx={{ borderColor: isUnread ? "primary.main" : "divider" }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start" justifyContent="space-between">
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip label={label} color={label === "Placement" ? "primary" : label === "Result" ? "secondary" : "default"} size="small" />
              {isUnread && <Chip label="New" color="success" size="small" />}
            </Stack>
            <Typography variant="h6">{notification.Message || notification.message}</Typography>
            <Typography variant="body2" color="text.secondary">
              {notification.Timestamp || notification.timestamp}
            </Typography>
          </Stack>
          <Button size="small" variant={isUnread ? "contained" : "outlined"} onClick={() => onView(notification.ID || notification.id)}>
            {isUnread ? "Mark viewed" : "Viewed"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default NotificationCard;
