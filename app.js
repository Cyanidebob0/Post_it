const express = require("express");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const umodel = require("./models/user");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  {
    res.render("index");
  }
});

app.post("/create", async (req, res) => {
  const { username, email, password, age } = req.body;

  const cryptpass = await bcrypt.hash(password, await bcrypt.genSalt(10));

  const newUser = await umodel.create({
    username,
    email,
    password: cryptpass,
    age,
  });

  let token = jwt.sign({ email }, "secret");
  res.cookie("token", token);

  res.send(newUser);
});

app.listen(3000);
