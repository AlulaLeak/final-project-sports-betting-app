// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 3019;
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const { response } = require("express");
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
        "INSERT INTO users(name, picture, id, email, nickname)VALUES($1, $2, $3, $4, $5) RETURNING *";
      !response.rows[0] &&
        db
          .query(insertionQueryString, insertionValues)
          .then((res) => {})
          .catch((e) => console.error(e.stack));
    })
    .catch((e) => console.error(e.stack));
});

app.post("/placebet", (req, res) => {
  // bring in info from request
  const { userId, betSlipArray, amountWagered, potentialPayout } = req.body;
  // create betslipID to avoid nesting promises
  const crypto = require("crypto");
  const betSlipId = crypto.randomBytes(20).toString("hex");
  // map through bet Slip Array to check if game exists and insert to table(games) if so
  // Insert betslip into db
  const betSlipValue = [betSlipId, userId, amountWagered, potentialPayout];
  const insertIntoBetSlip =
    "INSERT INTO bet_slip(id, user_id, amount_wagered, potential_payout, created_on)VALUES($1, $2, $3, $4, current_timestamp) RETURNING *;";
  db.query(insertIntoBetSlip, betSlipValue)
    .then((res) => {
      betSlipArray.map((bet) => {
        const selectValues = [bet.gameId];
        const selectQueryString = "SELECT id FROM games WHERE id = $1;";
        db.query(selectQueryString, selectValues).then((res) => {
          if (!res.rows[0]) {
            // Insert game into db (IF NOT ALREADY)
            const insValues = [bet.gameId];
            const insQueryString = "INSERT INTO games(id) VALUES ($1);";
            db.query(insQueryString, insValues).then((res) => {
              // Insert single-bet into betslip
              if (bet.betOn === "HOME") {
                if (bet.typeOfBet === "moneyline") {
                  const moneylineHomeValues = [
                    betSlipId,
                    bet.gameId,
                    bet.odds,
                    true,
                  ];
                  const moneylineHomeQuery =
                    "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_home)VALUES($1, $2, $3, $4) RETURNING *;";
                  db.query(moneylineHomeQuery, moneylineHomeValues)
                    .then((res) => {})
                    .catch((e) => console.error(e.stack));
                }
                if (bet.typeOfBet === "spread") {
                  const spreadHomeValues = [
                    betSlipId,
                    bet.gameId,
                    bet.odds,
                    true,
                    bet.spread,
                  ];
                  const spreadHomeQuery =
                    "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_home, spread)VALUES($1, $2, $3, $4, $5) RETURNING *;";
                  db.query(spreadHomeQuery, spreadHomeValues)
                    .then((res) => {})
                    .catch((e) => console.error(e.stack));
                }
              }
              if (bet.betOn === "AWAY") {
                if (bet.typeOfBet === "moneyline") {
                  const moneylineAwayValues = [
                    betSlipId,
                    bet.gameId,
                    bet.odds,
                    true,
                  ];
                  const moneylineAwayQuery =
                    "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_away) VALUES($1, $2, $3, $4) RETURNING *;";
                  db.query(moneylineAwayQuery, moneylineAwayValues)
                    .then((res) => {})
                    .catch((e) => console.error(e.stack));
                }
                if (bet.typeOfBet === "spread") {
                  const spreadAwayValues = [
                    betSlipId,
                    bet.gameId,
                    bet.odds,
                    true,
                    bet.spread,
                  ];
                  const spreadAwayQuery =
                    "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_away, spread)VALUES($1, $2, $3, $4, $5) RETURNING *;";
                  db.query(spreadAwayQuery, spreadAwayValues)
                    .then((res) => {})
                    .catch((e) => console.error(e.stack));
                }
              }
              if (bet.type === "OVER") {
                const overValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                  bet.total,
                ];
                const overQuery =
                  "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_over, total)VALUES($1, $2, $3, $4, $5) RETURNING *;";
                db.query(overQuery, overValues)
                  .then((res) => {})
                  .catch((e) => console.error(e.stack));
              }
              if (bet.betOn === "UNDER") {
                const underValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                  bet.total,
                ];
                const underQuery =
                  "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_under, total)VALUES($1, $2, $3, $4, $5) RETURNING *;";
                db.query(underQuery, underValues)
                  .then((res) => {})
                  .catch((e) => console.error(e.stack));
              }
            });
          } else {
            // Insert single-bet into betslip
            if (bet.betOn === "HOME") {
              if (bet.typeOfBet === "moneyline") {
                const moneylineHomeValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                ];
                const moneylineHomeQuery =
                  "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_home)VALUES($1, $2, $3, $4) RETURNING *;";
                db.query(moneylineHomeQuery, moneylineHomeValues).catch((e) =>
                  console.error(e.stack)
                );
              }
              if (bet.typeOfBet === "spread") {
                const spreadHomeValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                  bet.spread,
                ];
                const spreadHomeQuery =
                  "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_home, spread)VALUES($1, $2, $3, $4, $5) RETURNING *;";
                db.query(spreadHomeQuery, spreadHomeValues).catch((e) =>
                  console.error(e.stack)
                );
              }
            }
            if (bet.betOn === "AWAY") {
              if (bet.typeOfBet === "moneyline") {
                const moneylineAwayValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                ];
                const moneylineAwayQuery =
                  "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_away) VALUES($1, $2, $3, $4) RETURNING *;";
                db.query(moneylineAwayQuery, moneylineAwayValues).catch((e) =>
                  console.error(e.stack)
                );
              }
              if (bet.typeOfBet === "spread") {
                const spreadAwayValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                  bet.spread,
                ];
                const spreadAwayQuery =
                  "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_away, spread)VALUES($1, $2, $3, $4, $5) RETURNING *;";
                db.query(spreadAwayQuery, spreadAwayValues).catch((e) =>
                  console.error(e.stack)
                );
              }
            }

            if (bet.type === "OVER") {
              const overValues = [
                betSlipId,
                bet.gameId,
                bet.odds,
                true,
                bet.total,
              ];
              const overQuery =
                "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_over, total)VALUES($1, $2, $3, $4, $5) RETURNING *;";
              db.query(overQuery, overValues).catch((e) =>
                console.error(e.stack)
              );
            }
            if (bet.betOn === "UNDER") {
              const underValues = [
                betSlipId,
                bet.gameId,
                bet.odds,
                true,
                bet.total,
              ];
              const underQuery =
                "INSERT INTO single_bet(bet_slip_id, game_id, odds, bet_on_under, total)VALUES($1, $2, $3, $4, $5) RETURNING *;";
              db.query(underQuery, underValues).catch((e) =>
                console.error(e.stack)
              );
            }
          }
        });
      });
    })

    .catch((e) => console.error(e.stack));
});

app.post("/seebets", (req, res) => {
  const { userId } = req.body;

  const getOnGoingBetSlipValue = [userId];
  const getOnGoingBetSlipQuery = `SELECT id FROM bet_slip WHERE user_id = $1 AND win IS NULL`; // I want all bet slips from user
  let betSlipArray = [];
  db.query(getOnGoingBetSlipQuery, getOnGoingBetSlipValue).then((response) => {
    const betSlipArrayOfIds = response.rows;
    betSlipArrayOfIds.map((betSlip) => {
      const getOnGoingSingleBetsPerBetSlipValue = [betSlip.id];
      const getOnGoingSingleBetsPerBetSlipQuery = `SELECT * FROM single_bet WHERE bet_slip_id = $1 AND win IS NULL`; // I want all bet slips from user
      db.query(
        getOnGoingSingleBetsPerBetSlipQuery,
        getOnGoingSingleBetsPerBetSlipValue
      ).then((response) => {
        let bet = response.rows;
        betSlipArray = [...betSlipArray, bet];
        betSlipArrayOfIds.length === betSlipArray.length &&
          res.send(betSlipArray);
        console.log("This should be a full bet slip array:", betSlipArray);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
