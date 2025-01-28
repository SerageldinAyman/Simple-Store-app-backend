import userRouter from "./Modules/users/users.controller.js";
import productsRouter from "./Modules/products/products.controller.js";


const bootstrap = function (app, express) {
    //user router
    app.use(express.json());
    app.use("/user", userRouter);
    app.use("/products", productsRouter);
    app.all("*", (req, res) => {
        return res.status(404).json({ success: false, message: "not found" });
    });
};
export default bootstrap;