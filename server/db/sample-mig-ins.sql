 DROP TABLE IF EXISTS bet_slip;
 DROP TABLE IF EXISTS single_bet;
 DROP TABLE IF EXISTS games;
 DROP TABLE IF EXISTS users;



--  USERS

CREATE TABLE users (
	id VARCHAR (350) PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	picture VARCHAR ( 350 ),
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	balance int DEFAULT 4000,
	nickname VARCHAR ( 50 ) UNIQUE NOT NULL
);
-- (insertion on login)



-- GAMES

CREATE TABLE games (
  id INTEGER PRIMARY KEY
);

CREATE TABLE users (
	id VARCHAR (350) PRIMARY KEY,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	picture VARCHAR ( 350 ),
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	balance int DEFAULT 4000,
	nickname VARCHAR ( 50 ) UNIQUE NOT NULL
);

INSERT INTO games (id)
  VALUES (
    5
  );


-- BET SLIP


CREATE TABLE bet_slip (
  id serial PRIMARY KEY,
  user_id VARCHAR references users(id),
  amount_wagered int NOT NULL,
  potential_payout int NOT NULL,
  created_on TIMESTAMP NOT NULL,
  win BOOLEAN DEFAULT NULL
);

INSERT INTO bet_slip (
  user_id,
  amount_wagered,
  potential_payout,
  created_on
)
  VALUES (
    'google-oauth2|109718030698161816021',
    10,
    100,
    current_timestamp
  );




  -- SINGLE BET

CREATE TABLE single_bet (
  id serial PRIMARY KEY,
  bet_slip_id int references bet_slip(id),
  game_id int references games(id),
  odds int NOT NULL,
  spread int DEFAULT NULL,
  total int DEFAULT NULL,
  bet_on_home BOOLEAN DEFAULT NULL,
  bet_on_away BOOLEAN DEFAULT NULL,
  bet_on_over BOOLEAN DEFAULT NULL,
  bet_on_under BOOLEAN DEFAULT NULL,
  win BOOLEAN DEFAULT NULL
);

-- insert moneyline
INSERT INTO single_bet (
  bet_slip_id,
  odds,
  game_id,
  bet_on_home
)
  VALUES (
    1,
    -110,
    5,
    TRUE
  );

-- insert spread -home-favorite
INSERT INTO single_bet (
  bet_slip_id,
  odds,
  spread,
  game_id,
  bet_on_home
)
  VALUES (
    1,
    -110,
    -7,
    5,
    TRUE
  );

  -- insert spread -away-favorite
INSERT INTO single_bet (
  bet_slip_id,
  odds,
  spread,
  game_id,
  bet_on_away
)
  VALUES (
    1,
    -115,
    -11,
    5,
    TRUE
  );

  -- insert total -over
INSERT INTO single_bet (
  bet_slip_id,
  odds,
  total,
  game_id,
  bet_on_over
)
  VALUES (
    1,
    -115,
    210,
    5,
    TRUE
  );
