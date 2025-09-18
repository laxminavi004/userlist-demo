// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UrlShortener from "./pages/UrlShortener";
import Statistics from "./pages/Statistics";
import { AppBar, Toolbar, Button } from "@mui/material";
import { logEvent } from "./middleware/eventLogger";

function App() {
  const [urls, setUrls] = useState([]);

  // === THIS is the "first function" they will expect to see integrated with logging ===
  useEffect(() => {
    // Try retrieving a saved token (from registration) if available
    const token = localStorage.getItem("authToken") || null;

    // Call logging middleware right away when the app starts
    logEvent(
      { stack: "frontend", level: "info", pkg: "app", message: "App started" },
      token
    )
      .then(() => {
        /* optionally handle response */
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  function handleAddUrl(newUrl) {
    setUrls((prev) => [...prev, newUrl]);
  }

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Shorten
          </Button>
          <Button color="inherit" component={Link} to="/stats">
            Stats
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<UrlShortener onAddUrl={handleAddUrl} />} />
        <Route path="/stats" element={<Statistics urls={urls} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
