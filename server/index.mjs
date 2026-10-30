import express from "express";
import compression from "compression";
import nodemailer from "nodemailer";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateContact } from "./contact.mjs";
const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const recipient = "fayas818@gmail.com";
app.disable("x-powered-by");
app.use(compression());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  next();
});
app.use(express.json({ limit: "16kb" }));
const attempts = new Map();
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of attempts)
    if (now > bucket.until) attempts.delete(ip);
}, 60000);
cleanup.unref();
app.post("/api/contact", async (req, res) => {
  const origin = req.get("origin");
  if (origin) {
    try {
      const allowed = new URL(
        process.env.SITE_URL || `${req.protocol}://${req.get("host")}`,
      ).origin;
      const devOrigins =
        process.env.NODE_ENV === "production"
          ? []
          : ["http://127.0.0.1:5173", "http://localhost:5173"];
      if (
        new URL(origin).origin !== allowed &&
        !devOrigins.includes(new URL(origin).origin)
      )
        return res
          .status(403)
          .json({
            error: "Please submit this form from the portfolio website.",
          });
    } catch {
      return res.status(400).json({ error: "Invalid request origin." });
    }
  }
  const ip = req.ip || "unknown",
    now = Date.now();
  let bucket = attempts.get(ip);
  if (!bucket || now > bucket.until) {
    bucket = { count: 0, until: now + 15 * 60 * 1000 };
    attempts.set(ip, bucket);
  }
  bucket.count++;
  if (bucket.count > 5)
    return res
      .status(429)
      .json({
        error: "Please wait before trying again, or email me directly.",
      });
  const result = validateContact(req.body);
  if (result.spam)
    return res.status(400).json({ error: "Please email me directly." });
  if (result.error) return res.status(400).json({ error: result.error });
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM)
    return res.json({ mode: "mailto" });
  try {
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      ...(process.env.SMTP_USER
        ? {
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          }
        : {}),
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: recipient,
      replyTo: result.data.email,
      subject: `Portfolio inquiry: ${result.data.name.replace(/[\r\n]/g, " ")}`,
      text: `${result.data.message}\n\nFrom: ${result.data.name}\nReply to: ${result.data.email}`,
    });
    return res.json({ mode: "sent" });
  } catch {
    console.error(
      "Contact mail delivery failed. Check the SMTP configuration.",
    );
    return res
      .status(503)
      .json({
        error:
          "Email delivery is temporarily unavailable. Please email me directly.",
      });
  }
});
const origin = (req) => {
  if (process.env.SITE_URL) return new URL(process.env.SITE_URL).origin;
  return new URL(`${req.protocol}://${req.get("host")}`).origin;
};
app.get("/robots.txt", (req, res) =>
  res
    .type("text/plain")
    .send(
      `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin(req)}/sitemap.xml\n`,
    ),
);
app.get("/sitemap.xml", (req, res) => {
  const pages = [
    "/",
    "/projects/healthcare-operations",
    "/projects/skin-cancer-detection",
    "/projects/workforce-analytics",
    "/projects/connected-home",
  ];
  const site = origin(req)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  res
    .type("application/xml")
    .send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${site}${page}</loc></url>`).join("")}</urlset>`,
    );
});
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    contact:
      process.env.SMTP_HOST && process.env.SMTP_FROM ? "smtp" : "email-draft",
  }),
);
if (process.env.NODE_ENV === "production") {
  const { render } = await import("../dist-server/entry-server.js");
  const template = readFileSync(path.join(root, "dist", "index.html"), "utf8");
  const siteData = JSON.parse(
    readFileSync(path.join(root, "dist", "route-meta.json"), "utf8"),
  );
  const escape = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  app.use(
    express.static(path.join(root, "dist"), {
      index: false,
      maxAge: "1h",
      setHeaders: (res, file) => {
        if (
          file.includes("/assets/") ||
          file.includes("/images/") ||
          file.endsWith(".png")
        )
          res.setHeader("Cache-Control", "public,max-age=31536000,immutable");
      },
    }),
  );
  app.get("/{*path}", async (req, res) => {
    const meta = siteData.pages[req.path],
      site = origin(req),
      title = meta?.title || "Page not found — Muhammed Fayaz",
      description =
        meta?.description ||
        "Return to Muhammed Fayaz’s data and business intelligence portfolio.";
    const head = `<link data-rh="true" rel="canonical" href="${escape(site + req.path)}"/><meta data-rh="true" property="og:type" content="website"/><meta data-rh="true" property="og:title" content="${escape(title)}"/><meta data-rh="true" property="og:description" content="${escape(description)}"/><meta data-rh="true" property="og:image" content="${escape(site)}/og-image.png"/><meta data-rh="true" name="twitter:card" content="summary_large_image"/><meta data-rh="true" name="twitter:title" content="${escape(title)}"/><meta data-rh="true" name="twitter:description" content="${escape(description)}"/><meta data-rh="true" name="twitter:image" content="${escape(site)}/og-image.png"/><script data-rh="true" type="application/ld+json">${JSON.stringify({ ...siteData.person, url: site }).replace(/</g, "\\u003c")}</script>${meta ? "" : '<meta name="robots" content="noindex"/>'}`;
    const rendered = await render(req.originalUrl, site);
    res
      .status(meta ? 200 : 404)
      .type("html")
      .send(
        template
          .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`)
          .replace(
            /<title>.*?<\/title>/,
            `<title data-rh="true">${escape(title)}</title>`,
          )
          .replace(
            /<meta name="description"[^>]*>/,
            `<meta data-rh="true" name="description" content="${escape(description)}"/>`,
          )
          .replace("</head>", head + "</head>"),
      );
  });
}
app.use((error, _req, res, _next) =>
  res
    .status(error.status || 500)
    .json({
      error:
        error.status === 413
          ? "Your message is too long."
          : "Unable to process this request.",
    }),
);
const port = Number(process.env.PORT || 3001);
app.listen(port, "0.0.0.0", () =>
  console.log(
    `Portfolio ${process.env.NODE_ENV === "production" ? "production server" : "contact API"} listening on port ${port}`,
  ),
);
