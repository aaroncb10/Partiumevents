const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "awesumthreesum123", 
    database: "employee_db"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("Connected to MySQL database");
    }
});

app.get("/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/employee", (req, res) => {
    const { name, department, salary } = req.body;
    db.query("INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)", 
        [name, department, salary], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Employee added" });
        });
});

app.put("/employee/:id", (req, res) => {
    const { id } = req.params;
    const { name, department, salary } = req.body;
    db.query("UPDATE employees SET name=?, department=?, salary=? WHERE id=?", 
        [name, department, salary, id], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Employee updated" });
        });
});

app.delete("/employee/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Employee deleted" });
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
