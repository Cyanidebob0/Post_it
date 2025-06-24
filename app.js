const express = require("express");
const path = require("path");
const umodel = require("./models/user");
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pmodel = require("./models/post");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.post("/register", async (req, res) => {
  const { username, name, age, email, password } = req.body;
  const user1 = await umodel.findOne({ email });
  if (user1) {
    return res.status(409).send("User already exists");
  }
  const hashpass = await bcrypt.hash(password, await bcrypt.genSalt(10));
  await umodel.create({
    username,
    name,
    age,
    email,
    password: hashpass,
  });
  const token = jwt.sign({ email, userid: user._id }, "secret");
  res.cookie("token", token);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await umodel.findOne({ email });
  if (!user) {
    return res.status(500).send("Email or password is incorrect");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(500).send("Email or password is incorrect");
  }
  const token = jwt.sign({ email, userid: user._id });
  res.cookie("token", token);
});

app.listen(3000);
