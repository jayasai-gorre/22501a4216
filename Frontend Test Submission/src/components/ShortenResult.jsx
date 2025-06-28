import React from "react";
import { Alert, Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";

const ShortenResult = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Alert severity="success" sx={{ mt: 3 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <LinkIcon color="primary" />
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Shortened URL:
        </Typography>
        <a href={result.shortenedUrl} target="_blank" rel="noopener noreferrer">
          {result.shortenedUrl}
        </a>
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <IconButton size="small" onClick={handleCopy}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Expires At:</strong> {result.expiresAt}
      </Typography>
      {typeof result.clicks === "number" && (
        <Typography variant="body2">
          <strong>Clicks:</strong> {result.clicks}
        </Typography>
      )}
      {result.lastAccessed && (
        <Typography variant="body2">
          <strong>Last Accessed:</strong> {new Date(result.lastAccessed).toLocaleString()}
        </Typography>
      )}
    </Alert>
  );
};

export default ShortenResult;