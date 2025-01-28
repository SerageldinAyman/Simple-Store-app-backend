
import { Router } from "express";
import * as userService from "./users.service.js";
const router = Router();

router.post("/signup", userService.signup);
router.post("/login", userService.login);
router.post("/alter-table", userService.alterTable);
router.post("/truncate-table", userService.truncateTable);

export default router;

