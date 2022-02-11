const { Console } = require("console");
const pg = require("pg");
require("dotenv").config();

const connectionString = `postgress://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=disabled`;

const client = new pg.Client({
  connectionString: connectionString || process.env.DATABASE_URL,
});

console.log(`connected to ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
client.connect();

module.exports = client;
