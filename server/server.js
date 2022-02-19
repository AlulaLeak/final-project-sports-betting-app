// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 3020;
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
    url: `https://sportspage-feeds.p.rapidapi.com/games/?${getTodayAndTmoDate()}`,
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
        (game) => game.status === "final"
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
      // Find each single_bet where game_id == game.gameId
      // console.log("This is the finishedGameInfo: ", finishedGameInfo);
      !finishedGameInfo[0] &&
        console.log("There are no bets to resolve. Games aren't finished.");

      finishedGameInfo.map((game) => {
        console.log("this is the game: ", game);
        const getUnResolvedBetsValues = [game.gameId];
        const getUnResolvedBetsQuery = `
          SELECT *
          FROM single_bet
          WHERE win = NULL AND game_id = $1;
        `;
        db.query(getUnResolvedBetsQuery, getUnResolvedBetsValues).then(
          (unResolvedBets) => {
            const unResolvedBetArray = unResolvedBets.rows;

            unResolvedBetArray.map((unResolvedBet) => {
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
                // push!
                if (total === gameTotal) {
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
                      amount_wagered,
                      count: numberOfBets,
                      id: userid,
                    } = numberOfBetsAndAmountWageredAndUser.rows; // made up names (dont know whats structure is coming back from query)
                    const amountForUser = amount_wagered / numberOfBets;
                    const giveUserMoneyBackForPushValue = [
                      amountForUser,
                      userid,
                      bet_slip_id,
                      id,
                    ];
                    const giveUserMoneyBackForPushQuery = `
                        UPDATE users
                        SET balance = balance + $1
                        WHERE id = $2;
                        UPDATE bet_slip
                        SET amount_wagered = amount_wagered - $1
                        WHERE id = $2;
                        DELETE FROM single_bet WHERE id = $4;
                    `;
                    db.query(
                      giveUserMoneyBackForPushQuery,
                      giveUserMoneyBackForPushValue
                    ).then(() => {
                      db.query(
                        `
                        SELECT odds
                        FROM single_bet
                        WHERE bet_slip_id = $1;
                        SELECT amount_wagered
                        FROM bet_slip
                        WHERE id = $1;
                        `,
                        [bet_slip_id]
                      ).then((oddsAndAmountWageredFromNewBetSlip) => {});
                    });
                  });
                }
              }
              if (spread) {
                if (
                  // winner!
                  (scoreboard.score.away - scoreboard.score.home > spread &&
                    spread < 0 &&
                    bet_on_home) ||
                  (scoreboard.score.away - scoreboard.score.home < spread &&
                    spread > 0 &&
                    bet_on_home) ||
                  (scoreboard.score.home - scoreboard.score.away > spread &&
                    spread < 0 &&
                    bet_on_away) ||
                  (scoreboard.score.home - scoreboard.score.away < spread &&
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
                  (scoreboard.score.away - scoreboard.score.home > spread &&
                    spread > 0 &&
                    bet_on_home) ||
                  (scoreboard.score.away - scoreboard.score.home < spread &&
                    spread < 0 &&
                    bet_on_home) ||
                  (scoreboard.score.home - scoreboard.score.away > spread &&
                    spread > 0 &&
                    bet_on_away) ||
                  (scoreboard.score.home - scoreboard.score.away < spread &&
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
                if (
                  // push!
                  scoreboard.score.home - scoreboard.score.away === spread ||
                  scoreboard.score.away - scoreboard.score.home === spread
                ) {
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
                      amount_wagered,
                      count: numberOfBets,
                      id: userid,
                    } = numberOfBetsAndAmountWageredAndUser.rows; // made up names (dont know whats structure is coming back from query)
                    const amountForUser = amount_wagered / numberOfBets;
                    const giveUserMoneyBackForPushValue = [
                      amountForUser,
                      userid,
                      bet_slip_id,
                      id,
                    ];
                    const giveUserMoneyBackForPushQuery = `
                        UPDATE users
                        SET balance = balance + $1
                        WHERE id = $2;
                        UPDATE bet_slip
                        SET amount_wagered = amount_wagered - $1
                        WHERE id = $2;
                        DELETE FROM single_bet WHERE id = $4;
                    `;
                    db.query(
                      giveUserMoneyBackForPushQuery,
                      giveUserMoneyBackForPushValue
                    ).then(() => {
                      db.query(
                        `
                        SELECT odds
                        FROM single_bet
                        WHERE bet_slip_id = $1;
                        SELECT amount_wagered
                        FROM bet_slip
                        WHERE id = $1;
                        `,
                        [bet_slip_id]
                      ).then((oddsAndAmountWageredFromNewBetSlip) => {});
                    });
                  });
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

app.get("/", (req, res) => {
  res.send("yeshhh");
});

app.post("/users", (req, res) => {
  res.send("request came through!");

  const { name, picture, sub: id, email, nickname } = req.body;
  const selectUserValues = [id];
  const selectionQueryString = `
  SELECT *
  FROM users
  WHERE id = $1
  `;

  db.query(selectionQueryString, selectUserValues)
    .then((response) => {
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
      RETURNING *`;
      console.log("This is the user brought back: ", response.rows);
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

app.post("/balance", (req, res) => {
  const { userId } = req.body;

  const getUserBalanceValue = [userId];
  const getUserBalanceQuery = `
  SELECT balance
  FROM users
  WHERE id = $1;
    `;
  db.query(getUserBalanceQuery, getUserBalanceValue).then((response) => {
    res.send(response.rows[0].balance.toString());
    // console.log("The user's balance is:", response.rows[0].balance);
  });
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
      res.send(response.rows[0].balance.toString());
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
    socket.emit("working_test_message", allLeagues);
  }, 7000);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
