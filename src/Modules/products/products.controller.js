import { Router } from "express";
import * as productService from "./products.service.js";
const router = Router();


//products APIs
router.post("/", productService.addProduct);

router.patch("/soft-delete/:id", productService.softDelete);

router.delete("/:id", productService.deleteProductWithID);

router.get("/search", productService.searchWithID);

router.get("/in", productService.displayUsersWithID);

router.get("/", productService.displayProductsPrice);

router.get("/product-with-users", productService.displayUsersWiththeirProducts);

router.get("/max-price", productService.displayMaxProductPrice);

router.get("/top-expensive", productService.displayTopFiveProductsPrices);

export default router;