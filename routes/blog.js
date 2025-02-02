const { Router } = require("express");
const Blogs = require("../models/blog");
const path = require("path");
const multer = require("multer");
const Users = require("../models/user");
const Comment = require("../models/comment");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
const router = Router();
router.get("/addBlog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});
router.get("/:id", async (req, res) => {
  const blog = await Blogs.findById(req.params.id).populate("createdBy");
  //console.log(blog);
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    blog: blog,
    user: blog.createdBy,
    comments: comments,
  });
});
router.post("/comment/:id", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.id}`);
});
router.post("/addBlog", upload.single("coverImage"), async (req, res) => {
  const { title, body, coverImage } = req.body;
  const blog = await Blogs.create({
    title,
    body,
    coverImageURL: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  console.log(blog);
  return res.redirect(`/blog/${blog._id}`);
});
module.exports = router;
