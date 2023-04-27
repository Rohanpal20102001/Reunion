const express = require('express');
const postRouter = express.Router();
const {createPost, postComment, likePost, unlikePost,
allposts, getPost, deletePost,
} = require('../Controller/post');
const {auth} = require('../Middleware/auth');

postRouter.post('/post', auth, createPost);
postRouter.post('/comment', auth, postComment);
postRouter.post('/like', auth, likePost);
postRouter.post('/unlike', auth, unlikePost);
postRouter.get('/all_posts', auth, allposts);
postRouter.get('/posts', getPost);
postRouter.delete('/delete-posts', auth, deletePost);


module.exports = postRouter;