const express = require("express");
const path = require("path");

const umodel = require("./models/user");
const pmodel = require("./models/post");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  {
    res.render("index");
  }
});

app.get("/create", async (req, res) => {
  let user = await umodel.create({
    username: "bhuvan",
    email: "bhuvanannappa@gmail.com",
    age: "23",
  });
  res.send(user);
});

app.get("/post/create", async (req, res) => {
  let post = await pmodel.create({
    postdata: "hi i am bhuvan",
    user: "6858ed97b81333ac29810f77",
  });
  let user = await umodel.findOne({ _id: "6858ed97b81333ac29810f77" });
  user.posts.push(post._id);
  await user.save();
  res.send({ post, user });
});

app.listen(3000);
