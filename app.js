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

app.get("/feed", isLoggedin, (req, res) => {
  res.render("feed");
});

app.get("/profile", isLoggedin, async (req, res) => {
  const user = await umodel.findOne({ email: req.user.email });

  res.render("profile", { user: user });
});

app.post("/register", async (req, res) => {
  const { username, name, age, email, password } = req.body;
  const user = await umodel.findOne({ email });
  if (user) {
    return res.status(409).send("User already exists");
  }
  const hashpass = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const newUser = await umodel.create({
    username,
    name,
    age,
    email,
    password: hashpass,
  });
  const token = jwt.sign({ email, userid: newUser._id }, "secret");
  res.cookie("token", token);
  res.redirect("/profile");
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
  const token = jwt.sign({ email, userid: user._id }, "secret");
  res.cookie("token", token);
  res.redirect("/profile");
});

app.post("/profile", isLoggedin, async (req, res) => {
  const userId = req.user.userid;
  const { title, content } = req.body;
  const post = await pmodel.create({
    title,
    content,
    user: userId,
  });
  const user = await umodel.findOne({ _id: userId });
  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});

function isLoggedin(req, res, next) {
  if (!req.cookies.token || req.cookies.token === "") {
    return res.status(300).send("please login...");
  }
  try {
    const data = jwt.verify(req.cookies.token, "secret");
    req.user = data;
    next();
    console.log(data);
  } catch {
    res.status(403).send("invalid token...");
  }
}

app.listen(3000);
