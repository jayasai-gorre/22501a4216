import express from "express";
import logToFile from "../Logging Middleware/logging.js";
import cors from "cors";


const urlDB = new Map();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const chars = "abcedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const randomCode = (len = 8) => {
    let code = "";
    for (let i = 0; i < len; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

const validCode = (code) => {
    if (typeof code !== "string") return false;
    if (code.length < 4 || code.length > 20) return false;
    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const isUpper = char >= 'A' && char <= 'Z';
        const isLower = char >= 'a' && char <= 'z';
        const isDigit = char >= '0' && char <= '9';
        if (!(isUpper || isLower || isDigit)) return false;
    }
    return true;
};

app.post("/shorten", (req, res) => {
    const { name, location, url, validity, shortCode } = req.body;

    if (!url || typeof url !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid url"
        });
    }

    let code = shortCode;

    if (code) {
        if (!validCode(code)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shortcode"
            });
        }
        if (urlDB.has(code)) {
            return res.status(400).json({
                success: false,
                message: "shortCode already exists"
            });
        }
    } else {
        code = randomCode();
        while (urlDB.has(code)) {
            code = randomCode();
        }
    }

    let mins = 30;
    if (typeof validity === "number" && validity > 0) {
        mins = validity;
    }

    const expiresAt = Date.now() + mins * 60000;
    const shortened = `http://localhost:${PORT}/${code}`;

    urlDB.set(code, {
        name,
        location,
        mainUrl: url,
        shortenedUrl: shortened,
        expiresAt,
        clicks: 0,
        lastAccessed: null // Not accessed yet
    });

    return res.status(201).json({
        success: true,
        message: "Shortened successfully",
        shortenedUrl: shortened,
        expiresAt: new Date(expiresAt).toISOString(),
        clicks: 0,
        lastAccessed: null
    });
});

// This endpoint now redirects to the original URL if valid and not expired
app.get("/:code", (req, res) => {
    const { code } = req.params;
    const entry = urlDB.get(code);

    if (!entry) {
        return res.status(404).json({
            success: false,
            message: "Code not found"
        });
    }

    if (Date.now() > entry.expiresAt) {
        urlDB.delete(code);
        return res.status(410).json({
            success: false,
            message: "Code has expired"
        });
    }

    entry.clicks = (entry.clicks || 0) + 1;
    entry.lastAccessed = Date.now();

    logToFile({
        name: "Redirect",
        location: "GET /:code",
        mainUrl: entry.mainUrl,
        shortenedUrl: `http://localhost:${PORT}/${code}`,
        expiresAt: new Date(entry.expiresAt).toISOString()
    });

    res.redirect(entry.mainUrl);
});


app.get("/all/urls", (req, res) => {
    const allUrls = Array.from(urlDB.values());
    res.status(200).json({
        success: true,
        data: allUrls
    });
});


app.use((err, req, res, next) => {
    logToFile({
        name: "ServerError",
        location: `${req.method} ${req.url}`,
        mainUrl: "",
        shortenedUrl: "",
        expiresAt: ""
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log("server in port " + PORT);
    logToFile({
        name: "ServerStart",
        location: `PORT ${PORT}`,
        mainUrl: "",
        shortenedUrl: "",
        expiresAt: ""
    });
});