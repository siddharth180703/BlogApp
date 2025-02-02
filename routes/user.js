const { Router } = require("express");
const Users = require("../models/user");
const { setUser, getUser } = require("../services/auth");
const router = Router();
router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/login", (req, res) => {
  return res.render("login", {
    error: null,
  });
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login");
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).send("All fields are required");
  }
  await Users.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/user/login");
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }
    const user = await Users.matchPassword(email, password);
    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "INVALID USERNAME OR PASSWORD",
    });
  }
});
module.exports = router;
