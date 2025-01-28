import db from "../../DB/connection.js";

export const signup = (req, res) => {
    const { email, firstName, lastName, password, role } = req.body;

    const userQuery = `insert into users(email,firstName,lastName,password,role)
    value(?,?,?,?,?)`;
    const userValues = [email, firstName, lastName, password, role];

    db.execute(userQuery, userValues, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length > 0)
            if (results[0].email == email) return res.status(409).json({ success: false, message: "Email already exists." });
        return res.status(201).json({ success: true, message: "User added successfully" });
    });
};

export const login = (req, res) => {
    const { email, password } = req.body;

    const userQuery = `select * from users where email=? and password=?`;
    const userValues = [email, password];
    db.execute(userQuery, userValues, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length > 0) {
            if (results[0].email != email)
                return res.status(409).json({ success: false, message: `Invalid credentials` });
            return res.status(200).json({ success: true, message: `done.` });
        }
        return res.status(200).json({ success: true, message: `Invalid credentials.` });

    });
};

export const alterTable = (req, res) => {
    const { id } = req.body;
    const query = `select * from users where id = ?`;
    const values = [id];
    db.execute(query, values, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length > 0) {
            if (results[0].role != "admin") {
                return res.status(401).json({ success: false, message: `You don't have access` });
            }
            const adminQuery = `alter table users add column createdAt timestamp default current_timestamp;`;
            db.execute(adminQuery, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: error.message });
                return res.status(200).json({ success: true, message: "Done." });
            });
            return;
        }
        return res.status(404).json({ success: false, message: `User with id = ${id} not found` });
    });
};

export const truncateTable = (req, res) => {
    const { id } = req.body;
    const query = `select * from users where id=?`;
    const values = [id];
    db.execute(query, values, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length) {
            if (results[0].role != "admin")
                return res.status(401).json({ success: false, message: `You don't have access` });

            const adminQuery = ` truncate table products`;
            db.execute(adminQuery, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: error.message });
                return res.status(200).json({ success: true, message: "Done." });
            });
            return;
        }
        return res.status(404).json({ success: false, message: "User not found" });
    });

}; 