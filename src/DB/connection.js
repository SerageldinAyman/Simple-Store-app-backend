import mysql2 from "mysql2";


const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_store"
});

db.connect((error) => {
    if (error) return console.log(`failed to connect to db due to` + error.message);
    return console.log(`connected to db successfully`);
});

export default db;