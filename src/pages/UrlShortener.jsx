import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { logEvent } from "../middleware/eventLogger";

export default function UrlShortener({ onAddUrl }) {
  const [url, setUrl] = useState("");
  const [expiry, setExpiry] = useState("");
  const [shortcode, setShortcode] = useState("");
  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      new URL(url);
    } catch {
      alert("Invalid URL");
      await logEvent(
        {
          stack: "frontend",
          level: "warn",
          pkg: "validation",
          message: "Invalid URL input",
          meta: { url },
        },
        token
      );
      return;
    }

    const newUrl = {
      original: url,
      expiry: expiry ? Number(expiry) : 30,
      shortcode: shortcode || Math.random().toString(36).substring(2, 8),
    };

    await logEvent(
      {
        stack: "frontend",
        level: "info",
        pkg: "urlShortener",
        message: "Short URL created",
        meta: newUrl,
      },
      token
    );
    onAddUrl(newUrl);

    setUrl("");
    setExpiry("");
    setShortcode("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <TextField
        label="Original URL"
        fullWidth
        margin="normal"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <TextField
        label="Expiry (minutes)"
        type="number"
        fullWidth
        margin="normal"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />
      <TextField
        label="Custom Shortcode"
        fullWidth
        margin="normal"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />
      <Button type="submit" variant="contained">
        Shorten
      </Button>
    </Box>
  );
}
