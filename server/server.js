// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 3016;
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("yeshhh");
});

app.post("/users", (req, res) => {
  res.send("request came through!");

  const { name, picture, sub: id, email, nickname } = req.body;
  const selectUserValues = [id];
  const selectionQueryString = "SELECT * FROM users WHERE id = $1";

  db.query(selectionQueryString, selectUserValues)
    .then((response) => {
      const insertionValues = name
        ? [name, picture, id, email, nickname]
        : [email, "", randomStringId, email, email];
      const insertionQueryString =
        "INSERT INTO users(name, picture, id, email, nickname) VALUES($1, $2, $3, $4, $5) RETURNING *";

      !response.rows[0] &&
        db
          .query(insertionQueryString, insertionValues)
          .then((res) => {})
          .catch((e) => console.error(e.stack));
    })
    .catch((e) => console.error(e.stack));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
