import { Box, CircularProgress, Typography } from "@mui/material";

function Loader({ message = "Loading notifications…" }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4, flexDirection: "column", gap: 2 }}>
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default Loader;
