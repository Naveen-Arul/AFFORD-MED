import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "All Notifications", path: "/all" },
  { label: "Priority Inbox", path: "/priority" },
];

function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="sticky" color="primary" elevation={1} sx={{ mb: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Campus Notifications
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Clear, filterable updates for placements, events, and results.
          </Typography>
        </Box>
        <Box>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color={location.pathname === item.path ? "secondary" : "inherit"}
              sx={{ ml: 1, textTransform: "none" }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
