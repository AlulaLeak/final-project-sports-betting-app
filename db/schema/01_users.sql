DROP TABLE IF EXISTS users CASCADE:
CREATE TABLE users (
    user_id char,
    name varchar(255),
    picture varchar(255),
    email varchar(255),
    balance int DEFAULT 0 -- Rahwa double checking
    -- password varchar(255) **** FIND OUT IF NEEDED
);