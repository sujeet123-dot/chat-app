import  Express  from "express";

const router = Express.Router();

router.get("/", (req, res) => {
  res.send("this is message routes")
});

export default router;