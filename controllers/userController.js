const User = require("../model/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const token = require("../utils/token");
exports.authenticate = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }
  if (user.password !== password) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }
  token(user, res);
});

exports.follow = BigPromise(async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user.follower.includes(req.user.id)) {
      await user.updateOne({ $push: { follower: req.user.id } });
      await currentUser.updateOne({ $push: { following: req.params.id } });

      res.status(200).json({
        success: true,
        msg: "account followed successfully",
      });
    } else {
      res.status(200).json({
        success: true,
        msg: "you already follow this account",
      });
    }
  } else {
    res.status(200).json({
      success: true,
      msg: "you cant follow your own account",
    });
  }
});

exports.unfollow = BigPromise(async (req, res, next) => {
  if (req.params.id !== req.user.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (user.follower.includes(req.user.id)) {
      await user.updateOne({ $pull: { follower: req.user.id } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });

      res.status(200).json({
        success: true,
        msg: "account unfollowed successfully",
      });
    } else {
      res.status(200).json({
        success: true,
        msg: "you dont follow this account",
      });
    }
  } else {
    res.status(200).json({
      success: true,
      msg: "you cant unfollow your own account",
    });
  }
});

exports.user = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      followers: user.follower.length,
      followings: user.following.length,
    },
  });
});
