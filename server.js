const ITEMS_DIR = "./public/items";
const fs = require("fs");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8888;

app.use(express.static("dist"));

app.get("*data.json", async (req, res) => {
  const files = fs.readdirSync(ITEMS_DIR);
  const videos = files.filter(f => f.endsWith(".mp4"));
  const content = {
    data: videos.map(v => ({
      poster: `items/${v}.jpg`,
      video: `items/${v}`
    }))
  };

  res.set({
    "Content-Type": "application/json",
    "Content-Disposition": "attachment; filename=data.json",
    "Access-Control-Allow-Origin": "*"
  });
  res.send(JSON.stringify(content, null, 2) || "{}");
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

exports.app = app;
