const express = require("express");
const path = require("path");
const app = express();
const { connectMongoDb } = require("./connection");
const Blogs = require("./models/blog");
const userRoute = require("./routes/user");
const { checkforAuthentication, restrictTo } = require("./middleware/auth");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
connectMongoDb("mongodb://127.0.0.1:27017/blogging-website");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(checkforAuthentication);
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.get("/", restrictTo, async (req, res) => {
  const allBlogs = await Blogs.find({ createdBy: req.user._id });
  //console.log(allBlogs);
  return res.render("homePage", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/blog", blogRoute);
app.use("/user", userRoute);

app.listen("8000", () => {
  console.log("server started");
});
