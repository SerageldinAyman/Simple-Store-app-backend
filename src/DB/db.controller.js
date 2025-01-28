import { Router } from "express";
import { createTableInDB } from "./db.service";
const router = Router();



router.post("/DB/create-table", createTableInDB);

export default router;