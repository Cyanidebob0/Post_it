const express = require("express");
const app = express();
const path = require("path");
const umodel = require("./models/user");

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

app.post("/signup", (req, res) => {
  const { username, pass_1, pass_2 } = req.body;

  if (pass_1 !== pass_2) {
    return res.render("message", {
      title: "Error",
      alert: "Passwords do not match!",
      redirectTo: "/signup",
      delay: 5000,
    });
  }

  // Save user logic here...

  res.render("message", {
    title: "Success",
    alert: "User registered successfully!",
    redirectTo: "/",
    delay: 5000,
  });
});

app.listen(3000);
