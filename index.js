const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite DB (will create file if it doesn't exist)
const db = new Database("mydb.sqlite");

// Create users table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`).run();

// 🔽 Check if users already exist
const existing = db.prepare("SELECT COUNT(*) AS count FROM users").get();
if (existing.count === 0) {
  const insert = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  insert.run("Lesedi Skosana", "lesedi@example.com");
  insert.run("Ada Lovelace", "ada@history.com");
  insert.run("Alan Turing", "turing@computing.org");
  insert.run("Grace Hopper", "grace@navy.mil");
  insert.run("Jack Sparrow", "jack@pirates.com");
  console.log("✅ Sample users inserted into local DB");
}


// GET /users → Fetch all users
app.get("/users", (req, res) => {
  const stmt = db.prepare("SELECT * FROM users");
  const users = stmt.all();
  res.json(users);
});

// POST /users → Insert a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  const info = stmt.run(name, email);
  res.status(201).json({ id: info.lastInsertRowid, name, email });
});

// API health check
app.get("/", (req, res) => {
  res.json({ message: "API working with local SQLite DB" });
});

// Start server
app.listen(4000, () => {
  console.log("🚀 Local API running at http://localhost:4000");
});


