const User = require("../model/user");
const BigPromise = require("../middlewares/bigPromise");
const token = require("../utils/token");
exports.authenticate = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      msg: "Provide valid credentials",
    });
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400).json({
      success: false,
      msg: "Provide valid credentials",
    });
  }
  if (user.password !== password) {
    res.status(400).json({
      success: false,
      msg: "Provide valid credentials",
    });
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
        success: false,
        msg: "you already follow this account",
      });
    }
  } else {
    res.status(200).json({
      success: false,
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
        success: false,
        msg: "you dont follow this account,please follow first",
      });
    }
  } else {
    res.status(200).json({
      success: false,
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
