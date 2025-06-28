import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
  InputAdornment
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { shortenUrl } from "../services/api";

const ShortenForm = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    url: "",
    validity: "",
    shortCode: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    try {
      // Prepare data, only send validity if it's a number
      const payload = {
        ...form,
        validity: form.validity ? Number(form.validity) : undefined
      };
      const res = await shortenUrl(payload);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.message || "Failed to shorten URL");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError("Network or server error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        <LinkIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        URL Shortener
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <TextField
          label="Long URL"
          name="url"
          value={form.url}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          label="Validity (minutes, optional)"
          name="validity"
          type="number"
          value={form.validity}
          onChange={handleChange}
        />
        <TextField
          label="Custom Shortcode (optional)"
          name="shortCode"
          value={form.shortCode}
          onChange={handleChange}
        />
        <Button variant="contained" type="submit">
          Shorten
        </Button>
      </Box>

      {result && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <div>
            <strong>Shortened URL:</strong>{" "}
            <a href={result.shortenedUrl} target="_blank" rel="noopener noreferrer">
              {result.shortenedUrl}
            </a>
          </div>
          <div>
            <strong>Expires At:</strong> {result.expiresAt}
          </div>
          <div>
            <strong>Clicks:</strong> {result.clicks}
          </div>
        </Alert>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ShortenForm;