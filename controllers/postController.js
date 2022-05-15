const BigPromise = require("../middlewares/bigPromise");
const Post = require("../model/post");
const Comment = require("../model/Comment");
const User = require("../model/user");

exports.addpost = BigPromise(async (req, res, next) => {
  const { title, description } = req.body;

  const user = await User.findById(req.user.id);

  const post = await Post.create({
    title,
    desc: description,
  });

  await user.updateOne({ $push: { post: post.id } });

  res.status(200).json({
    success: true,
    msg: "Post Successfully added",
    data: {
      id: post._id,
      title: post.title,
      description: post.desc,
      cratedTime: post.createdAt,
    },
  });
});

exports.deletepost = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.post.includes(req.params.id)) {
    await Post.findByIdAndDelete(req.params.id);

    await user.updateOne({ $pull: { post: req.params.id } });
    res.status(200).json({
      success: true,
      msg: "Post deleted successfully",
    });
  } else {
    res.status(200).json({
      success: true,
      msg: "Post not exists with given id",
    });
  }
});

exports.like = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.post.includes(req.params.id)) {
    const post = await Post.findById(req.params.id);
    if (!post.like.includes(req.user.id)) {
      await Post.updateOne({ $push: { like: req.user.id } });
      res.status(200).json({
        success: true,
        msg: "Post liked successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        msg: "You have already liked this post",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      msg: "Post not exists with given id",
    });
  }
});

exports.unlike = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.post.includes(req.params.id)) {
    const post = await Post.findById(req.params.id);
    if (post.like.includes(req.user.id)) {
      await Post.updateOne({ $pull: { like: req.user.id } });
      res.status(200).json({
        success: true,
        msg: "Post unliked successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        msg: "Please like the post first",
      });
    }
  } else {
    res.status(404).json({
      success: true,
      msg: "Post not exists with given id",
    });
  }
});

exports.comment = BigPromise(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  const comment = await Comment.create({
    comment: req.body.comment,
    commentator: req.user.id,
  });

  await post.updateOne({ $push: { comment: comment._id } });

  res.status(200).json({
    success: true,
    msg: "Post Successfully added",
    data: {
      id: comment._id,
      comment: comment.comment,
    },
  });
});

exports.specificpost = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.post.includes(req.params.id)) {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: {
        id: post._id,
        likes: post.like.length,
        comments: post.comment.length,
      },
    });
  } else {
    res.status(404).json({
      success: false,
      msg: "Post not exists with given id",
    });
  }
});

exports.allpost = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let posts = [];

  for (const post in user.post) {
    const currpost = await Post.findById(user.post[post]).populate("comment");
    posts.push(currpost);
  }

  const response = posts.map((post) => {
    return {
      id: post._id,
      title: post.title,
      desc: post.desc,
      created_at: post.createdAt,
      comments: post.comment.map((com) => {
        return com.comment;
      }),
      likes: post.like.length,
    };
  });
  res.status(200).json({
    success: true,
    data: response,
  });
});
