import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AppConfigurationClient } from "@azure/app-configuration";
import { DefaultAzureCredential } from "@azure/identity";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.WEBSITES_PORT || process.env.PORT || 8080;
const distPath = path.join(__dirname, "dist");
const featureRefreshSeconds = Number.parseInt(process.env.FEATURE_FLAGS_REFRESH_SECONDS || "30", 10);

const featureAliases = {
  FEATURE_PUBLIC_FEED_ENABLED: ["FEATURE_PUBLIC_FEED_ENABLED", "PUBLIC_FEED"],
  FEATURE_PHOTO_UPLOAD_ENABLED: ["FEATURE_PHOTO_UPLOAD_ENABLED", "PHOTO_UPLOAD"],
  FEATURE_MAINTENANCEMODE_ENABLED: ["FEATURE_MAINTENANCEMODE_ENABLED", "MaintenanceMode"],
};

let cachedFeatureFlags = null;
let cachedFeatureTimestamp = 0;
let featureRefreshPromise = null;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ||
    process.env.VITE_BACKEND_URL ||
    "http://localhost:5000"
  );
}

function getBooleanEnv(name, defaultValue) {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return defaultValue;
  }

  return ["true", "1", "yes", "on"].includes(String(rawValue).trim().toLowerCase());
}

function getAppConfigurationClient() {
  const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

  if (connectionString) {
    return new AppConfigurationClient(connectionString);
  }

  const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;

  if (endpoint) {
    return new AppConfigurationClient(endpoint, new DefaultAzureCredential());
  }

  return null;
}

function toBoolean(rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return undefined;
  }

  if (typeof rawValue === "boolean") {
    return rawValue;
  }

  const normalized = String(rawValue).trim().toLowerCase();

  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }

  return undefined;
}

async function readFeatureFlagsFromAppConfiguration() {
  const client = getAppConfigurationClient();

  if (!client) {
    return {};
  }

  const result = {};

  for await (const setting of client.listConfigurationSettings({ keyFilter: ".appconfig.featureflag/*" })) {
    if (!setting.value) {
      continue;
    }

    try {
      const parsed = JSON.parse(setting.value);
      const id = parsed?.id;
      const enabled = toBoolean(parsed?.enabled);

      if (id && enabled !== undefined) {
        result[id] = enabled;
      }
    } catch {
      continue;
    }
  }

  return result;
}

async function getRawFeatureFlags() {
  const now = Date.now();
  const refreshMs = Math.max(Number.isNaN(featureRefreshSeconds) ? 30 : featureRefreshSeconds, 5) * 1000;

  if (cachedFeatureFlags && now - cachedFeatureTimestamp < refreshMs) {
    return cachedFeatureFlags;
  }

  if (!featureRefreshPromise) {
    featureRefreshPromise = readFeatureFlagsFromAppConfiguration()
      .then((flags) => {
        cachedFeatureFlags = flags;
        cachedFeatureTimestamp = Date.now();
        return flags;
      })
      .catch(() => {
        cachedFeatureFlags = {};
        cachedFeatureTimestamp = Date.now();
        return cachedFeatureFlags;
      })
      .finally(() => {
        featureRefreshPromise = null;
      });
  }

  return featureRefreshPromise;
}

function getFlagValue(rawFlags, canonicalName, defaultValue) {
  for (const alias of featureAliases[canonicalName]) {
    const appConfigValue = toBoolean(rawFlags[alias]);

    if (appConfigValue !== undefined) {
      return appConfigValue;
    }
  }

  return getBooleanEnv(canonicalName, defaultValue);
}

async function getFeatureFlags() {
  const rawFlags = await getRawFeatureFlags();

  return {
    FEATURE_PUBLIC_FEED_ENABLED: getFlagValue(rawFlags, "FEATURE_PUBLIC_FEED_ENABLED", true),
    FEATURE_PHOTO_UPLOAD_ENABLED: getFlagValue(rawFlags, "FEATURE_PHOTO_UPLOAD_ENABLED", true),
    FEATURE_MAINTENANCEMODE_ENABLED: getFlagValue(rawFlags, "FEATURE_MAINTENANCEMODE_ENABLED", false),
  };
}

function sendText(
  res,
  statusCode,
  text,
  contentType = "text/plain; charset=utf-8",
) {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
  });

  res.end(text);
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  res.end(JSON.stringify(data));
}

function isPathInside(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

async function serveFile(res, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  const content = await fs.readFile(filePath);

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control":
      extension === ".html"
        ? "no-store"
        : "public, max-age=31536000, immutable",
  });

  res.end(content);
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === "/health") {
      return sendJson(res, 200, {
        status: "healthy",
        app: "quotes-frontend",
        timestamp: new Date().toISOString(),
      });
    }

    if (pathname === "/config.js") {
      const apiBaseUrl = getApiBaseUrl();
      const featureFlags = await getFeatureFlags();

      return sendText(
        res,
        200,
        `window.__APP_CONFIG__ = ${JSON.stringify({ API_BASE_URL: apiBaseUrl, ...featureFlags })};`,
        "application/javascript; charset=utf-8",
      );
    }

    let requestedPath =
      pathname === "/"
        ? path.join(distPath, "index.html")
        : path.join(distPath, pathname);

    if (!isPathInside(distPath, requestedPath)) {
      return sendText(res, 403, "Forbidden");
    }

    try {
      const stat = await fs.stat(requestedPath);

      if (stat.isDirectory()) {
        requestedPath = path.join(requestedPath, "index.html");
      }

      return await serveFile(res, requestedPath);
    } catch {
      const fallbackPath = path.join(distPath, "index.html");
      return await serveFile(res, fallbackPath);
    }
  } catch (error) {
    console.error("Frontend server error:", error);
    return sendText(res, 500, "Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Quotes frontend running on port ${port}`);
  console.log(`Serving static files from: ${distPath}`);
  console.log(`API_BASE_URL: ${getApiBaseUrl()}`);
});
