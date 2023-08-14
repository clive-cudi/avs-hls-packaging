const express = require("express");
const app = express();
const port = 4000;
const fs = require("fs");
const { resolve } = require("path");

app.use(require("cors")());

app.get("/file/*", (req, res) => {
  try {
    const path = req.params[0] ? resolve(__dirname, req.params[0]) : "";
    console.log(path);
    if (!fs.existsSync(path)) {
      throw new Error("path not found");
    }
    return res.status(200).sendFile(path);
  } catch (err) {
    console.log(err);
    return res.status(400).send("error");
  }
});

app.listen(port, () => {
  console.log(`[INIT] Listening on port ${port}`);
});
