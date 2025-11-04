import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite3");

export default db;
