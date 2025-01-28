import db from "../../DB/connection.js";


export const addProduct = (req, res) => {
    const { name, stock, price, id } = req.body;
    const checkUserQuery = `select * from users where id=? and role = "admin"`;
    const value = [id];

    db.execute(checkUserQuery, value, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });

        if (results.length > 0) {
            //user exists
            const productQuery = `insert into products(name,stock,price) 
            values(?,?,?)`;
            const productValues = [name, stock, price];
            db.execute(productQuery, productValues, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: error.message });
                if (results.affectedRows > 0)
                    return res.status(200).json({ success: true, message: "Product added" });
            });
        }
        else {
            //user not exist
            return res.status(404).json({ success: false, message: "User not found / not authorized to add a product" });
        }
    });
};

export const softDelete = (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const adminQuery = `select * from users where id=? and role= "admin"`;
    const adminValues = [userId];
    db.execute(adminQuery, adminValues, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length > 0) {
            //user exists and authorized 
            const productQuery = `select * from products where id=? and isDeleted = 0`;
            const productValues = [id];
            db.execute(productQuery, productValues, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: error.message });
                if (results.length > 0) {
                    //product exists and not already deleted
                    const softdelQuery = `update products set isDeleted = 1 where id=?`;
                    const softdelValue = [id];
                    db.execute(softdelQuery, softdelValue, (error, results) => {
                        if (error) return res.status(500).json({ success: false, error: error.message });
                        if (results.affectedRows > 0)
                            return res.status(200).json({ success: true, message: "Product soft-deleted successfully." });
                    });
                } else // product already soft-deleted or not found
                    return res.status(404).json({ success: false, message: "Product not found or already soft-deleted" });
            });
        } else // user doesn't exist or not authorized 
            return res.status(403).json({ success: false, message: "Not allowed to delete a product or user not found" });
    });
};

export const deleteProductWithID = (req, res) => {
    const { id } = req.params;

    //insure this operation made by admin only 
    const { userId } = req.body;

    const adminQuery = `select * from users where id=? and role = "admin"`;
    const adminValues = [userId];
    db.execute(adminQuery, adminValues, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length > 0) {
            //user exists and authorized 
            const productQuery = `select * from products where id=?`;
            const productValues = [id];
            db.execute(productQuery, productValues, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: error.message });
                if (results.length > 0) {
                    //product exists and not already deleted
                    const softdelQuery = `delete from products where id=?`;
                    const softdelValue = [id];
                    db.execute(softdelQuery, softdelValue, (error, results) => {
                        if (error) return res.status(500).json({ success: false, error: error.message });
                        if (results.affectedRows > 0)
                            return res.status(200).json({ success: true, message: "Product deleted successfully." });
                    });
                } else // product already soft-deleted or not found
                    return res.status(404).json({ success: false, message: "Product not found or already deleted" });
            });
        } else // user doesn't exist or not authorized 
            return res.status(403).json({ success: false, message: "Not allowed to delete a product or user not found" });
    });
};

export const searchWithID = (req, res) => {
    const { id } = req.params;

    //insure this operation made by admin only 
    const { userId } = req.body;

    const adminQuery = `select * from users where id=? and role = "admin"`;
    const adminValues = [userId];
    db.execute(adminQuery, adminValues, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length > 0) {
            //user exists and authorized 
            const productQuery = `select * from products where id=?`;
            const productValues = [id];
            db.execute(productQuery, productValues, (error, results) => {
                if (error) return res.status(500).json({ success: false, error: error.message });
                if (results.length > 0) {
                    //product exists and not already deleted
                    const softdelQuery = `delete from products where id=?`;
                    const softdelValue = [id];
                    db.execute(softdelQuery, softdelValue, (error, results) => {
                        if (error) return res.status(500).json({ success: false, error: error.message });
                        if (results.affectedRows > 0)
                            return res.status(200).json({ success: true, message: "Product deleted successfully." });
                    });
                } else // product already soft-deleted or not found
                    return res.status(404).json({ success: false, message: "Product not found or already deleted" });
            });
        } else // user doesn't exist or not authorized 
            return res.status(403).json({ success: false, message: "Not allowed to delete a product or user not found" });
    });
};

export const displayUsersWithID = (req, res) => {

    const { ids } = req.query;

    const idArr = ids.split(",");

    if (!idArr.every(id => !isNaN(id))) {
        return res.status(400).json({ success: false, error: "Invalid IDs provided" });
    }
    const bluePrint = idArr.map(id => `?`).join(`,`);

    const query = `select id,name,price from products where id in(${bluePrint})`;
    db.execute(query, idArr, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length) return res.status(200).json({ success: true, results: results });
    });
};

export const displayProductsPrice = (req, res) => {
    const query = `select name as productName,price as cost  from products where isDeleted = 0 `;
    db.execute(query, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length) return res.status(200).json({ success: true, results: results });
    });
};

export const displayUsersWiththeirProducts = (req, res) => {

    const query = `select 
    products.name as productName ,users.email 
    from 
    products join users
    on 
    products.user_id = users.id
    `;

    db.execute(query, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length)
            return res.status(200).json({ success: true, results });
    });
};

export const displayMaxProductPrice = (req, res) => {

    const query = ` select max(price) as maxPrice from products`;

    db.execute(query, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length) {
            return res.status(200).json({ success: true, results });
        } else {
            return res.status(404).json({ success: false, message: "No products found" });
        }
    });
};

export const displayTopFiveProductsPrices = (req, res) => {

    const query = ` select name,price from products order by price desc limit 5 `;

    db.execute(query, (error, results) => {
        if (error) return res.status(500).json({ success: false, error: error.message });
        if (results.length) {
            return res.status(200).json({ success: true, results });
        } else {
            return res.status(404).json({ success: false, message: "No products found" });
        }
    });
}; 