const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple proxy endpoint: POST /proxy?method=GET&path=/mobile-versions/ios/employee
app.all("/proxy/*", async (req, res) => {
  try {
    const targetPath = req.path.replace("/proxy", "");
    const targetHost = req.query.host; // full base host like https://api.dar-al-ahfad.ouredu.net
    if (!targetHost)
      return res.status(400).json({ message: "missing host query param" });

    const targetUrl = `${targetHost}${targetPath}${
      req.url.includes("?") ? "" : ""
    }`.replace("?", "");

    const method = req.method.toLowerCase();

    const axiosConfig = {
      method,
      url: targetUrl,
      headers: {},
      data: req.body,
      validateStatus: () => true,
    };

    // Forward Accept and Content-Type from the incoming request if present
    if (req.headers["accept"])
      axiosConfig.headers["Accept"] = req.headers["accept"];
    if (req.headers["content-type"])
      axiosConfig.headers["Content-Type"] = req.headers["content-type"];

    const response = await axios(axiosConfig);

    res.status(response.status).set(response.headers).send(response.data);
  } catch (err) {
    console.error("proxy error", err?.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () =>
  console.log(`Proxy server running on http://localhost:${port}`)
);
