import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import ShortenForm from "./components/ShortenForm";
import AllUrls from "./components/AllUrls";

const App = () => {
  return (

      <div>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 32 }}>
          <LinkIcon color="primary" fontSize="large" style={{ marginRight: 8 }} />
          <h1 style={{ margin: 0 }}>URL Shortener</h1>
        </header>
        <nav style={{ display: "flex", justifyContent: "center", gap: 24, margin: "24px 0" }}>
          <Link to="/" style={{ textDecoration: "none", fontWeight: 500 }}>Shorten URL</Link>
          <Link to="/all-urls" style={{ textDecoration: "none", fontWeight: 500 }}>All URLs</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ShortenForm />} />
          <Route path="/all-urls" element={<AllUrls />} />
        </Routes>
      </div>
  );
};

export default App;