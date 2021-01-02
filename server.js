const express = require("express");

const app = express();
const PORT = process.env.PORT || 8888;

app.use(express.static("dist"));

app.get("*data.json", async (req, res) => {
  const content = {
    data: Array(10).fill({
      poster: "/img/IMG_3498.jpg",
      // base url is /public
      video:
        "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
    })
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
