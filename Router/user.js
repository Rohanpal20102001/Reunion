const express = require('express');
const { signup, signin, userProfile, followUser, unFollowUser } = require('../Controller/user');
const { auth } = require('../Middleware/auth');
const userRouter = express.Router();


userRouter.post('/signup', signup);
userRouter.post('/authenticate', signin);
userRouter.get('/user',auth, userProfile);
userRouter.post('/follow', auth, followUser);
userRouter.post('/unfollow', auth, unFollowUser);

module.exports = userRouter;