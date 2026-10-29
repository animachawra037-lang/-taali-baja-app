import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Taali Baja" });
});
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
