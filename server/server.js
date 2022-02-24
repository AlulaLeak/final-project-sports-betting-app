// load .env data into process.env
require("dotenv").config();
const crypto = require("crypto");

// Web server config
const PORT = process.env.PORT || 3021;
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const axios = require("axios").default;

// Date Function
const getTodayAndTmoDate = require("./helpers/getTodayAndTmoDate.js");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const { response } = require("express");
const { Console } = require("console");
const db = new Pool(dbParams);
db.connect();

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

//Fetch Games Score and Odds
let fetchedAllGameInfo;
let fetchedNhlGameInfo;
let fetchedNbaGameInfo;
let fetchedNflGameInfo;
let fetchedMlbGameInfo;
let fetchedFinishedGameInfo;
let fetchedOnGoingGameInfo;
let fetchedScheduledGameInfo;
setInterval(() => {
  let options = {
    method: "GET",
    url: `https://sportspage-feeds.p.rapidapi.com/games/?${getTodayAndTmoDate()}&skip=100`,
    headers: {
      "x-rapidapi-host": process.env.REACT_APP_X_RAPIDAPI_HOST,
      "x-rapidapi-key": process.env.REACT_APP_X_RAPIDAPI_KEY,
    },
  };
  return axios
    .request(options)
    .then((response) => {
      fetchedAllGameInfo = response.data.results;
      fetchedNbaGameInfo = fetchedAllGameInfo.filter(
        (game) => game.details.league === "NBA"
      );
      fetchedNflGameInfo = fetchedAllGameInfo.filter(
        (game) => game.details.league === "NFL"
      );
      fetchedNhlGameInfo = fetchedAllGameInfo.filter(
        (game) => game.details.league === "NHL"
      );
      fetchedMlbGameInfo = fetchedAllGameInfo.filter(
        (game) => game.details.league === "MLB"
      );
      fetchedFinishedGameInfo = fetchedAllGameInfo.filter(
        (game) => game.status === "final" || !game.status
      );
      fetchedOnGoingGameInfo = fetchedAllGameInfo.filter(
        (game) => game.status === "in progress"
      );
      fetchedScheduledGameInfo = fetchedAllGameInfo.filter(
        (game) => game.status === "scheduled"
      );
      return fetchedFinishedGameInfo;
    })
    .then((finishedGameInfo) => {
      !finishedGameInfo[0] && console.log("Games aren't finished.");

      finishedGameInfo.map((game) => {
        const getUnResolvedBetsValues = [game.gameId];
        const getUnResolvedBetsQuery = `
        SELECT *
        FROM single_bet
        WHERE win IS NULL AND game_id = $1;
        `;
        db.query(getUnResolvedBetsQuery, getUnResolvedBetsValues).then(
          (unResolvedBets) => {
            const unResolvedBetArray = unResolvedBets.rows;

            unResolvedBetArray.map((unResolvedBet) => {
              console.log(
                "this is the games of the unresolved bets : ",
                unResolvedBet
              );
              const {
                bet_on_home,
                bet_on_away,
                bet_on_over,
                bet_on_under,
                total,
                spread,
                id,
                bet_slip_id,
              } = unResolvedBet;
              const gameTotal =
                game.scoreboard.score.away + game.scoreboard.score.home;
              console.log(
                "This is the gameTotal for the unresolved bet: ",
                gameTotal,
                " -  This is the total wagered on: ",
                total
              );
              if (total) {
                // winner!
                if (
                  (bet_on_under && total > gameTotal) ||
                  (bet_on_over && total < gameTotal)
                ) {
                  db.query(
                    `
                    UPDATE single_bet
                      SET win = TRUE
                      WHERE id = $1;
                    `,
                    [id]
                  );
                }
                if (
                  (bet_on_under && total < gameTotal) ||
                  (bet_on_over && total > gameTotal)
                ) {
                  // loser!
                  db.query(
                    `
                    UPDATE single_bet
                      SET win = FALSE
                      WHERE id = $1;
                    `,
                    [id]
                  );
                }
              }
              if (
                // push!
                game.scoreboard.score.home - game.scoreboard.score.away ===
                  spread ||
                game.scoreboard.score.away - game.scoreboard.score.home ===
                  spread ||
                total === gameTotal
              ) {
                console.log("Program knows this is a push!");
                const getNumberOfBetsInBetSlipValue = [bet_slip_id];
                const getNumberOfBetsInBetSlipQuery = `
                      SELECT count(*), bet_slip.amount_wagered, users.id
                      FROM single_bet
                      JOIN bet_slip ON bet_slip.id = bet_slip_id
                      JOIN users ON bet_slip.user_id = users.id
                      WHERE bet_slip.id = $1
                      GROUP BY bet_slip.amount_wagered, users.id;
                    `;
                db.query(
                  getNumberOfBetsInBetSlipQuery,
                  getNumberOfBetsInBetSlipValue
                ).then((numberOfBetsAndAmountWageredAndUser) => {
                  const {
                    amount_wagered: fullAmountWagered,
                    count: numberOfBets,
                    id: userid,
                  } = numberOfBetsAndAmountWageredAndUser.rows[0];
                  const amountForUser = fullAmountWagered / numberOfBets;

                  const giveUserMoneyBackForPushValue = [amountForUser, userid];
                  const subractBetSlipMoneyBackForPushValue = [
                    amountForUser,
                    bet_slip_id,
                  ];
                  const query = `
                      UPDATE users
                      SET balance = balance + $1
                      WHERE id = $2;

                      `;
                  db.query(query, giveUserMoneyBackForPushValue);
                  const giveUserMoneyBackForPushQuery = `

                          UPDATE bet_slip
                          SET amount_wagered = amount_wagered - $1
                          WHERE id = $2;
                      `;
                  db.query(
                    giveUserMoneyBackForPushQuery,
                    subractBetSlipMoneyBackForPushValue
                  )
                    .then(() => {
                      const betSlipIdent = crypto
                        .randomBytes(20)
                        .toString("hex");
                      db.query(
                        `
                          INSERT INTO bet_slip(
                            id,
                            user_id,
                            amount_wagered,
                            potential_payout,
                            win,
                            created_on
                            )
                          VALUES(
                            $1,
                            $2,
                            $3,
                            $3,
                            TRUE,
                            current_timestamp
                            )
                          RETURNING *;
                          `,
                        [betSlipIdent, userid, amountForUser]
                      );
                      return betSlipIdent;
                    })
                    .then((betSlipId) => {
                      db.query(
                        `
                            ALTER TABLE single_bet
                            DROP CONSTRAINT IF EXISTS single_bet_bet_slip_id_fkey;
                            `
                      ).then(() => {
                        db.query(
                          `
                              UPDATE single_bet
                              SET bet_slip_id = $1
                              WHERE id = $2
                              RETURNING *;`,
                          [betSlipId, id]
                        )
                          .then(() => {
                            db.query(
                              `
                                UPDATE single_bet
                                SET win = TRUE
                                WHERE
                                  id = $1;
                                `,
                              [id]
                            );
                          })
                          .then((res) => {
                            // ****
                            db.query(
                              `
                              SELECT odds, bet_slip.amount_wagered
                              FROM single_bet
                              JOIN bet_slip ON bet_slip_id = bet_slip.id
                              WHERE bet_slip_id = $1;
                              `,
                              [bet_slip_id]
                            ).then((oddsAndAmountWageredFromNewBetSlip) => {
                              console.log(
                                "These should be the new indiviual odds for each game in the betslip: ",
                                oddsAndAmountWageredFromNewBetSlip.rows
                              );
                              const aWagered =
                                oddsAndAmountWageredFromNewBetSlip.rows[0]
                                  .amount_wagered;
                              let oddArray = [];
                              let allOdds = [];
                              let currentOdd = 1;

                              oddsAndAmountWageredFromNewBetSlip.rows.map(
                                (oddAndAWagered) => {
                                  const { odds } = oddAndAWagered;
                                  oddArray.push(odds);
                                }
                              );

                              oddArray.map((eachOdd) => {
                                if (eachOdd > 0) {
                                  allOdds.push(eachOdd / 100 + 1);
                                } else {
                                  allOdds.push(100 / Math.abs(eachOdd) + 1);
                                }
                              });
                              console.log(
                                "This is the single number odds: ",
                                allOdds
                              );
                              allOdds.map((eachnewOdd) => {
                                currentOdd = currentOdd * eachnewOdd;
                              });
                              console.log(
                                "This is the current odd: ",
                                currentOdd
                              );
                              let potPayout = (
                                parseFloat(currentOdd * aWagered) * 0.9
                              ).toFixed(2);
                              console.log(
                                "This is the potential payout: ",
                                potPayout
                              );
                              db.query(
                                `
                                    UPDATE bet_slip
                                    SET potential_payout = $2
                                    WHERE id = $1
                                    RETURNING *;`,
                                [bet_slip_id, potPayout]
                              );
                            });
                          });
                      });
                    })
                    .then(() => {
                      // db.query(
                      //   `
                      //   ALTER TABLE single_bet
                      //   ADD CONSTRAINT single_bet_bet_slip_id_fkey;
                      //   `
                      // );
                    })
                    .then(() => {});
                });
              }
              if (spread) {
                if (
                  // winner!
                  (game.scoreboard.score.away - game.scoreboard.score.home >
                    spread &&
                    spread < 0 &&
                    bet_on_home) ||
                  (game.scoreboard.score.away - game.scoreboard.score.home <
                    spread &&
                    spread > 0 &&
                    bet_on_home) ||
                  (game.scoreboard.score.home - game.scoreboard.score.away >
                    spread &&
                    spread < 0 &&
                    bet_on_away) ||
                  (game.scoreboard.score.home - game.scoreboard.score.away <
                    spread &&
                    spread > 0 &&
                    bet_on_away)
                ) {
                  db.query(
                    `
                    UPDATE single_bet
                      SET win = TRUE
                      WHERE id = $1;
                    `,
                    [id]
                  );
                }
                if (
                  // loser!
                  (game.scoreboard.score.away - game.scoreboard.score.home >
                    spread &&
                    spread > 0 &&
                    bet_on_home) ||
                  (game.scoreboard.score.away - game.scoreboard.score.home <
                    spread &&
                    spread < 0 &&
                    bet_on_home) ||
                  (game.scoreboard.score.home - game.scoreboard.score.away >
                    spread &&
                    spread > 0 &&
                    bet_on_away) ||
                  (game.scoreboard.score.home - game.scoreboard.score.away <
                    spread &&
                    spread < 0 &&
                    bet_on_away)
                ) {
                  db.query(
                    `
                    UPDATE single_bet
                      SET win = FALSE
                      WHERE id = $1;
                    `,
                    [id]
                  );
                }
              }
              if (!spread && !total) {
                if (
                  // winner
                  (bet_on_home &&
                    game.scoreboard.score.home > game.scoreboard.score.away) ||
                  (bet_on_away &&
                    game.scoreboard.score.home < game.scoreboard.score.away)
                ) {
                  db.query(
                    `
                    UPDATE single_bet
                      SET win = TRUE
                      WHERE id = $1;
                    `,
                    [id]
                  );
                }
                if (
                  // loser
                  (bet_on_away &&
                    game.scoreboard.score.home > game.scoreboard.score.away) ||
                  (bet_on_home &&
                    game.scoreboard.score.home < game.scoreboard.score.away)
                ) {
                  db.query(
                    `
                    UPDATE single_bet
                      SET win = FALSE
                      WHERE id = $1;
                    `,
                    [id]
                  );
                }
              }
            });
          }
        );
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}, 5000);

setInterval(() => {
  db.query(
    `
    SELECT *
    FROM bet_slip
    WHERE bet_slip.win IS NULL;
    `
  ).then((unResolvedBetSlips) => {
    const unResBetSlipArray = unResolvedBetSlips.rows;

    unResBetSlipArray.map((unResolvedSlip) => {
      const unResolvedSingleBetValues = [unResolvedSlip.id];
      const unResolvedSingleBetQuery = `
      SELECT array_agg(win)
      FROM single_bet
      WHERE bet_slip_id = $1;
      `;
      db.query(unResolvedSingleBetQuery, unResolvedSingleBetValues).then(
        (unResolvedBetSlipOutComes) => {
          const betOutcomeArray = unResolvedBetSlipOutComes.rows[0].array_agg;
          betOutcomeArray.map((outcomeOfSingleBet) => {
            outcomeOfSingleBet === false &&
              db.query(
                `
              UPDATE bet_slip
              SET win = FALSE
              WHERE
	            bet_slip.id = $1;
              `,
                [unResolvedSlip.id]
              );
          });

          if (betOutcomeArray.every((outcome) => outcome === true)) {
            db.query(
              `
              UPDATE bet_slip
              SET win = TRUE
              WHERE
              bet_slip.id = $1;
              `,
              [unResolvedSlip.id]
            ).then((res) => {
              db.query(
                `
                UPDATE users
                SET balance = balance + (SELECT potential_payout FROM bet_slip WHERE id = $1)
                WHERE users.id = $2;
                `,
                [unResolvedSlip.id, unResolvedSlip.user_id]
              );
            });
          }
        }
      );
    });
  });
}, 5000);

setInterval(() => {}, 2000);

app.get("/", (req, res) => {
  res.send("yeshhh");
});

let usrId;
let userBalance;
app.post("/users", (req, res) => {
  res.send("request came through!");

  const { name, picture, sub: id, email, nickname } = req.body;
  usrId = id;
  const selectUserValues = [id];
  const selectionQueryString = `
  SELECT *
  FROM users
  WHERE id = $1
  `;

  db.query(selectionQueryString, selectUserValues)
    .then((response) => {
      console.log("This is the response: ", response.rows);
      const insertionValues = name
        ? [name, picture, id, email, nickname]
        : [email, "", randomStringId, email, email];
      const insertionQueryString = `
      INSERT INTO users(
          name,
          picture,
          id,
          email,
          nickname
          )
      VALUES(
          $1,
          $2,
          $3,
          $4,
          $5
          )
      RETURNING *;`;
      !response.rows[0] &&
        db
          .query(insertionQueryString, insertionValues)
          .then((res) => {
            console.log("This is the res: ", res.rows);
          })
          .catch((e) => console.error(e.stack));
    })
    .catch((e) => console.error(e.stack));
});

app.post("/placebet", (req, res) => {
  // bring in info from request
  const { userId, betSlipArray, amountWagered, potentialPayout } = req.body;
  // create betslipID to avoid nesting promises
  const betSlipId = crypto.randomBytes(20).toString("hex");
  // map through bet Slip Array to check if game exists and insert to table(games) if so
  // Insert betslip into db
  const betSlipValue = [betSlipId, userId, amountWagered, potentialPayout];
  const insertIntoBetSlip = `
  INSERT INTO bet_slip(
    id,
    user_id,
    amount_wagered,
    potential_payout,
    created_on
    )
  VALUES(
    $1,
    $2,
    $3,
    $4,
    current_timestamp
    )
  RETURNING *;
  `;
  db.query(insertIntoBetSlip, betSlipValue)
    .then((res) => {
      betSlipArray.map((bet) => {
        const selectValues = [bet.gameId];
        const selectQueryString = `
        SELECT id
        FROM games
        WHERE id = $1;
        `;
        db.query(selectQueryString, selectValues).then((res) => {
          if (!res.rows[0]) {
            // Insert game into db (IF NOT ALREADY)
            const insValues = [bet.gameId, bet.teamsPlaying];
            const insQueryString = `
            INSERT INTO games(
              id,
              teams_playing
              )
            VALUES (
              $1,
              $2
              );
            `;
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
                  const moneylineHomeQuery = `INSERT INTO single_bet(
                      bet_slip_id,
                      game_id,
                      odds,
                      bet_on_home
                      )
                    VALUES(
                      $1,
                      $2,
                      $3,
                      $4
                      )
                    RETURNING *;`;
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
                  const spreadHomeQuery = `
                  INSERT INTO single_bet(
                    bet_slip_id,
                    game_id,
                    odds,
                    bet_on_home,
                    spread
                    )
                  VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                    )
                  RETURNING *;
                  `;
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
                  const moneylineAwayQuery = `
                  INSERT INTO single_bet(
                    bet_slip_id,
                    game_id, odds,
                    bet_on_away
                    )
                  VALUES(
                    $1,
                    $2,
                    $3,
                    $4
                    )
                  RETURNING *;
                  `;
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
                  const spreadAwayQuery = `
                  INSERT INTO single_bet(
                    bet_slip_id,
                    game_id,
                    odds,
                    bet_on_away,
                    spread
                    )
                  VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                    )
                  RETURNING *;
                  `;
                  db.query(spreadAwayQuery, spreadAwayValues)
                    .then((res) => {})
                    .catch((e) => console.error(e.stack));
                }
              }
              if (bet.betOn === "OVER") {
                const overValues = [
                  betSlipId,
                  bet.gameId,
                  bet.odds,
                  true,
                  bet.total,
                ];
                const overQuery = `
                INSERT INTO single_bet(
                  bet_slip_id,
                  game_id,
                  odds,
                  bet_on_over,
                  total
                  )
                VALUES(
                  $1,
                  $2,
                  $3,
                  $4,
                  $5
                  )
                RETURNING *;
                `;
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
                const underQuery = `
                INSERT INTO single_bet(
                  bet_slip_id,
                  game_id,
                  odds,
                  bet_on_under,
                  total
                  )
                VALUES(
                  $1,
                  $2,
                  $3,
                  $4,
                  $5
                  )
                RETURNING *;
                `;
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
                const moneylineHomeQuery = `
                INSERT INTO single_bet(
                  bet_slip_id,
                  game_id,
                  odds,
                  bet_on_home
                  )
                VALUES($1, $2, $3, $4) RETURNING *;
                `;
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
                const spreadHomeQuery = `
                INSERT INTO single_bet(
                  bet_slip_id,
                  game_id,
                  odds,
                  bet_on_home,
                  spread
                  )
                VALUES($1, $2, $3, $4, $5) RETURNING *;
                `;
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
                const moneylineAwayQuery = `
                  INSERT INTO single_bet(
                    bet_slip_id,
                    game_id,
                    odds,
                    bet_on_away
                    )
                  VALUES($1, $2, $3, $4) RETURNING *;
                  `;
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
                const spreadAwayQuery = `
                  INSERT INTO single_bet(
                    bet_slip_id,
                    game_id,
                    odds,
                    bet_on_away,
                    spread
                    )
                  VALUES($1, $2, $3, $4, $5) RETURNING *;
                  `;
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
              const overQuery = `
                INSERT INTO single_bet(
                  bet_slip_id,
                  game_id,
                  odds,
                  bet_on_over,
                  total
                  )
                VALUES($1, $2, $3, $4, $5) RETURNING *;
                `;
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
              const underQuery = `
                INSERT INTO single_bet(
                  bet_slip_id,
                  game_id,
                  odds,
                  bet_on_under,
                  total
                  )
                VALUES($1, $2, $3, $4, $5) RETURNING *;
                `;
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
  const getOnGoingBetSlipQuery = `
  SELECT id
  FROM bet_slip
  WHERE user_id = $1 AND win IS NULL;
    `;

  let betSlipArray = [];
  db.query(getOnGoingBetSlipQuery, getOnGoingBetSlipValue)
    .then((response) => {
      const betSlipArrayOfIds = response.rows;
      betSlipArrayOfIds.map((betSlip) => {
        const getOnGoingSingleBetsPerBetSlipValue = [betSlip.id];
        const getOnGoingSingleBetsPerBetSlipQuery = `
                                                  SELECT
                                                     *,
                                                     games.teams_playing,
                                                     bet_slip.amount_wagered
                                                  FROM
                                                     single_bet
                                                  INNER JOIN
                                                     games ON games.id = game_id
                                                  INNER JOIN
                                                     bet_slip ON bet_slip.id = bet_slip_id
                                                  WHERE (bet_slip_id = $1 AND bet_slip.win IS NULL);
                                                  `;
        db.query(
          getOnGoingSingleBetsPerBetSlipQuery,
          getOnGoingSingleBetsPerBetSlipValue
        ).then((response) => {
          let betSlip = response.rows;
          betSlipArray.push(betSlip);
          betSlipArrayOfIds.length === betSlipArray.length &&
            res.send(betSlipArray);
        });
      });
    })
    .then((aresponse) => {});
});

app.post("/balance/after-checkout", (req, res) => {
  const { amountWagered, userId } = req.body;

  const balanceDifferenceValue = [amountWagered, userId];
  const setBalanceDifferenceQuery = `
  UPDATE users
  SET balance = balance - $1
  WHERE id = $2
  RETURNING *;
  `;
  db.query(setBalanceDifferenceQuery, balanceDifferenceValue).then(
    (response) => {
      res.send(response.rows[0].balance.toFixed(2).toString());
    }
  );
});

io.on("connection", (socket) => {
  setInterval(() => {
    const allLeagues = {
      fetchedNhlGameInfo,
      fetchedNbaGameInfo,
      fetchedNflGameInfo,
      fetchedMlbGameInfo,
      fetchedAllGameInfo,
    };
    socket.emit("league_games", allLeagues);
  }, 1000);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });

  socket.on("user_info", (userInfo) => {
    db.query(
      `
      SELECT balance
      FROM users
      WHERE id = $1;
      `,
      [userInfo.sub]
    ).then((res) => {
      const blnce = res.rows[0];
      socket.emit("user_balance", blnce);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
