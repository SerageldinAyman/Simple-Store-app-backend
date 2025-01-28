import db from "./connection.js";


export const createTableInDB = (req, res) => {

    const createUsersTable = `create table users(
    id int(11) not null auto_increment,
    email varchar(20) not null UNIQUE,
    firstName varchar(10) not null,
    lastName varchar(10) not null,
    password varchar(8) not null,
    role varchar(10) not null,

    PRIMARY KEY(id)
    )`;

    const createUserPNTable = `create table user_PhoneNum(
    id int(11) not null auto_increment,
    user_id int,
    phone varchar(11) not null,

    PRIMARY KEY(id),
    foreign key(user_id) references users(id) on delete cascade on update cascade
    )`;

    const createProductsTable = `create table products(
    id int(11) not null auto_increment,
    name varchar(15) not null,
    stock int(8) not null, 
    price decimal(8,2) not null,
    isDeleted boolean default 0,

    user_id int,

    primary key(id),
    foreign key(user_id) references users(id)
    )`;

    db.query(createUsersTable, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: `error creating the users table` });

        db.query(createUserPNTable, (error, results) => {
            if (error) return res.status(500).json({ success: false, error: `error creating the users phone numbers table` });

            db.query(createProductsTable, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: `error creating the products table` });
                return res.status(201).json({ success: true, message: `Tables created successfully` });
            });
        });
    });
};