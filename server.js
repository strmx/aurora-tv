const express = require("express");

const app = express();
const PORT = process.env.PORT || 8888;

app.get("*data.json", async (req, res) => {
  const content = {
    data: Array(10).fill({ poster: "https://source.unsplash.com/random" })
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
