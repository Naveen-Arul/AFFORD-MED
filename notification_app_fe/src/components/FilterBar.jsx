import { Box, FormControl, InputLabel, Select, MenuItem, Stack, Typography } from "@mui/material";

function FilterBar({ notificationType, setNotificationType, topN, setTopN, showTopSelector }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="type-filter-label">Notification type</InputLabel>
        <Select
          labelId="type-filter-label"
          label="Notification type"
          value={notificationType}
          onChange={(event) => setNotificationType(event.target.value)}
        >
          <MenuItem value="">All types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {showTopSelector && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="topn-select-label">Top N</InputLabel>
          <Select
            labelId="topn-select-label"
            label="Top N"
            value={topN}
            onChange={(event) => setTopN(Number(event.target.value))}
          >
            {[5, 10, 15, 20].map((value) => (
              <MenuItem key={value} value={value}>
                Top {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Use filters to narrow the notification list.
        </Typography>
      </Box>
    </Stack>
  );
}

export default FilterBar;
