const express = require("express");
const app = express();
const path = require("path");
const umodel = require("./models/user");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, pass_1, pass_2 } = req.body;

  const userExistes = await umodel.findOne({ userName: username });
  if (userExistes) {
    return res.render("message", {
      title: "Error",
      alert: "Passwords do not match!",
      redirectTo: "/signup",
      delay: 5000,
    });
  }

  if (pass_1 !== pass_2) {
    return res.render("message", {
      title: "Error",
      alert: "Passwords do not match!",
      redirectTo: "/signup",
      delay: 5000,
    });
  }

  const pass = await bcrypt.hash(pass_1, await bcrypt.genSalt(10));

  umodel.create({
    userName: username,
    password: pass,
  });

  res.render("message", {
    title: "Success",
    alert: "User registered successfully!",
    redirectTo: "/",
    delay: 5000,
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const uE = await umodel.findOne({ userName: username });

  if (!uE) {
    return res.render("message", {
      title: "Error",
      alert: "Invalid username or password",
      redirectTo: "/",
      delay: 5000,
    });
  }

  const isMatch = await bcrypt.compare(password, uE.password);

  if (!isMatch) {
    return res.render("message", {
      title: "Error",
      alert: "Invalid username or password",
      redirectTo: "/",
      delay: 5000,
    });
  }

  res.render("oioi");
});

app.listen(3000);
