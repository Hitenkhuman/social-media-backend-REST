const express = require("express");
const router = express.Router();

//import the controler
const {
  user,
  authenticate,
  follow,
  unfollow,
} = require("../controllers/userController");

const {
  addpost,
  deletepost,
  like,
  unlike,
  comment,
  specificpost,
  allpost,
} = require("../controllers/postController");

//imports of middleware
const { isLoggedIn } = require("../middlewares/isLoggedIn");
//user routes
router.route("/authenticate").post(authenticate);
router.route("/follow/:id").post(isLoggedIn, follow);
router.route("/unfollow/:id").post(isLoggedIn, unfollow);
router.route("/user").get(isLoggedIn, user);

//post routes
router.route("/posts").post(isLoggedIn, addpost);
router.route("/posts/:id").delete(isLoggedIn, deletepost);
router.route("/like/:id").post(isLoggedIn, like);
router.route("/unlike/:id").post(isLoggedIn, unlike);
router.route("/comment/:id").post(isLoggedIn, comment);
router.route("/posts/:id").get(isLoggedIn, specificpost);
router.route("/all_posts").get(isLoggedIn, allpost);

module.exports = router;
