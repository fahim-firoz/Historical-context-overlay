import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  console.log("Proxying request to:", targetUrl);
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error proxying request:", error);
    res.status(500).send("Error proxying request");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
