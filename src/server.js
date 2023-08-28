const express = require("express");
const app = express();

const host = 4000;

app.get("/", function (req, res) {
  res.send("Hello Trello Api");
});

app.listen(host, () => {
  console.log(`Server is runing at port ${host}`);
});
