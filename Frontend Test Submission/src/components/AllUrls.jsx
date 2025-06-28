import React, { useEffect, useState } from "react";
import { getAllUrls } from "../services/api";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const AllUrls = () => {
  const [allUrls, setAllUrls] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    getAllUrls().then(res => {
      if (res.success) setAllUrls(res.data);
    });
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <Paper elevation={2} sx={{ mt: 6, p: 2, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        All Shortened URLs
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Main URL</TableCell>
              <TableCell>Shortened URL</TableCell>
              <TableCell align="right">Expires At</TableCell>
              <TableCell align="right">Clicks</TableCell>
              <TableCell align="right">Last Accessed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUrls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No URLs found.
                </TableCell>
              </TableRow>
            ) : (
              allUrls.map((row) => (
                <TableRow key={row.shortenedUrl}>
                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>{row.location || "-"}</TableCell>
                  <TableCell>
                    <a href={row.mainUrl} target="_blank" rel="noopener noreferrer">
                      {row.mainUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={row.shortenedUrl} target="_blank" rel="noopener noreferrer">
                      {row.shortenedUrl}
                    </a>
                    <Tooltip title={copied === row.shortenedUrl ? "Copied!" : "Copy"}>
                      <IconButton size="small" onClick={() => handleCopy(row.shortenedUrl)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    {row.expiresAt ? new Date(row.expiresAt).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell align="right">{typeof row.clicks === "number" ? row.clicks : 0}</TableCell>
                  <TableCell align="right">
                    {row.lastAccessed ? new Date(row.lastAccessed).toLocaleString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AllUrls;