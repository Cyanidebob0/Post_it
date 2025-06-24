const express = require("express");
const path = require("path");
const umodel = require("./models/user");
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

app.post("/register", async (req, res) => {
  const { username, name, age, email, password } = req.body;
  const user1 = await umodel.findOne({ email });
  if (user1) {
    return res.status(409).send("User already exists");
  }
  const hashpass = await bcrypt.hash(password,await bcrypt.genSalt(10));
    await umodel.create({
    username,
    name,
    age,
    email,
    password: hashpass,
    
  });
});

app.post("/login", (req, res) => {});

app.listen(3000);
