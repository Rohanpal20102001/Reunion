const Post = require("../Model/Posts");
const User = require("../Model/User");

const createPost = async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({
      message: "Provide title",
    });
  }
  if (!description) {
    return res.status(400).json({
      message: "Provide title",
    });
  }
  try {
    const post = await Post({
      title,
      description,
      user: req.user,
    });
    await post.save();
    return res.status(200).json({
      "post id": post._id,
      "post title": post.title,
      "description": post.description,
      "createdAt": post.createdAt,
    });
  } catch (err) {
    console.log(err);
  }
};

const postComment = async (req, res) => {
  const { postid, comment } = req.body;
  if (!postid) {
    return res.status(400).json({
      message: "Provide post id",
    });
  }

  if (!comment) {
    return res.status(400).json({
      message: "Provide comment",
    });
  }
  try {
    const reqPost = await Post.findOne({ _id: postid });
    reqPost.comments.push({
      userId: req.user._id,
      comment: comment,
    });
    await reqPost.save();
    return res.status(200).json({
      reqPost,
    });
  } catch (err) {
    console.log(err);
  }
};

const likePost = async (req, res) => {
  const { postid } = req.body;
  if (!req.user) {
    return res.status(400).json({
      message: "unAuthorized",
    });
  }
  try {
    const post = await Post.findById(postid);
    post.like.push(post._id);
    await post.save();
    return res.status(200).json({
      post,
    });
  } catch (err) {
    console.log(err);
  }
};

const unlikePost = async (req, res) => {
  const { postid } = req.body;
  if (!req.user) {
    return res.status(400).json({
      message: "unAuthorized",
    });
  }
  try {
    const post = await Post.findById(postid);
    post.unlike.push(post._id);
    await post.save();
    return res.status(200).json({
      post,
    });
  } catch (err) {
    console.log(err);
  }
};

const allposts = async (req, res) => {
    const {page = 1, recordsPerPage = 10} = req.query;
  if (!req.user) {
    return res.status(400).json({
      message: "unAuthorized",
    });
  }
  try {
    await Post.find({user : req.user._id})
    .sort({createdAt : "desc"})
    .limit(recordsPerPage)
    .skip((page-1)*recordsPerPage)
    .then(async (posts) => {
        if(!posts) {
            return res.status(400).json({
                message : "Post not found!"
            })
        }
        const count = await Post.countDocuments({user : req.user._id})
        return res.status(200).json({
            posts : {
                posts,
            },
            totalPosts : count,
        })
    });
  } catch (err) {
    console.log(err);
  }
};

const getPost = async(req,res) => {
    if (!req.user._id) {
        return res.status(400).send("unAuthorized");
    }

    const { postid } = req.query;
    if(!postid) {
        return res.status(400).json({
            message : "Provide post id"
        })
    }
    try{
        const post = await Post.findById(postid);
        if(!post) {
            return res.status(500).json({
                message : "Post doesn't exists"
            })
        }
        return res.status(200).json({
            "id" : post._id,
            "title" : post.title,
            "description" : post.description,
            "no Of likes" : post.like.length,
            "no Of Comments" : post.comments.length
        })
    } catch(err) {
        console.log(err);
    }
};

const deletePost = async(req, res) => {
    if (!req.user._id) {
        return res.status(400).send("unAuthorized");
    }

    const { postid } = req.query;
    if(!postid)
    {
        return res.status(400).json({
            message : "Provide post id"
        });
    }
    try{
        const post = await Post.findByIdAndDelete(postid);
        if(!post) {
            return res.status(500).json({
                message : "Post doesn't exists"
            });
        }
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { userBlogs: postid },
        });
        res.status(200).json({
            message: "Post has been Deleted Successfully",
        });

    } catch(err) {
        console.log(err);
    }
};

module.exports = {
  createPost,
  postComment,
  likePost,
  unlikePost,
  allposts,
  getPost,
  deletePost
};
