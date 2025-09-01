import express from "express";
import { login, signingup } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signingup);
router.post("/login", login);

export default router;
