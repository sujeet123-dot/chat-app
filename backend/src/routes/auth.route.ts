import Express  from "express";
import { signup } from "../controllers/auth.controller";

const router = Express.Router()

router.post("/signup", signup);

router.get("/login", (req, res) => {
  res.send("Login endpoint")
});

router.get("/logout", (req, res) => {
  res.send("Logout endpoint")
});

export default router;