const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  if(!userName) {
    return res.status(400).json({
        message : "Provide user name"
    })
  }
  if(!email) {
    return res.status(400).json({
        message : "Provide email"
    })
  }
  if(!password) {
    return res.status(400).json({
        message : "Provide password"
    })
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        message: "User already exists",
      });
    }
  } catch (err) {
    console.log(err);
  }
  const hashedPassword = bcrypt.hashSync(password);
  try {
    const user = User({
      userName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(200).json({
        userDetails : {
            user
        }
      })
  } catch (err) {
    console.log(err);
  }
};

const signin = async (req,res) => {
    const {email, password} = req.body;
    if(!email) {
        return res.status(400).json({
            message : "Provide email id"
        })
    }
    if(!password) {
        return res.status(400).json({
            message : "Provide password"
        })
    }

    let user;
    try{
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user not found, Please signup before proceeding.",
        });
        } 
        else 
        {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Incorrect Password" });
            } 
            else 
            {
                const payload = { email : email };

                const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: 31556926, // 1 year in seconds
                },
                (err, token) => {
                    if (err) {
                    return res.status(500).send(err);
                    }
                    return res.status(200).json({
                    message: "User logged in",
                    token: token,
                    });
                }
                );
                user.isAccountVerified = true;
                user.email = email;
                await user.save(); 
            } 
        }
    }catch(err) {
        console.log(err);
    }
}

const userProfile = async(req,res) => {
    if(!req.user) {
        return res.status(400).json({
            message : "User unAuthorized"
        })
    }
    try{
        const user = await User.findOne({_id : req.user._id});
        if(!user) {
            return res.status(500).json({
                message : "User not found!"
            })
        }
        return res.status(200).json({
            "userName" : user.userName,
            "Number-of-followers" : user.numberOfFollowers.length,
            "Number-of-followings" : user.numberOfFollowings.length
        })
    }catch(err) {
        console.log(err);
    }
}

const followUser = async(req,res) => {
    const {userId} = req.body;
    if(!req.user) {
        return res.status(400).json({
            message : "User unAuthorized"
        })
    }
    if(!userId) {
        return res.status(500).json({
            message : "Provide user id"
        })
    }
    try {
        const user = await User.findOne({_id : userId});
        if(!userId) {
            return res.status(500).json({
                message : "User id not found"
            })
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push : { numberOfFollowings: userId }
        });
        await User.findByIdAndUpdate(userId,{
            $push:{ numberOfFollowers: req.user._id}
        });
        await user.save();

        return res.status(200).json({
            message : `You started following ${userId}`
        })
    } catch(err) {
        console.log(err);
    }
}

const unFollowUser = async(req,res) => {
    const {userId} = req.body;
    if(!req.user) {
        return res.status(400).json({
            message : "User unAuthorized"
        })
    }
    if(!userId) {
        return res.status(500).json({
            message : "Provide user id"
        })
    }
    try {
        const user = await User.findOne({_id : userId});
        if(!userId) {
            return res.status(500).json({
                message : "User id not found"
            })
        }

        await User.findByIdAndUpdate(req.user._id, {
            $pull : { numberOfFollowings: userId }
        });
        await User.findByIdAndUpdate(userId,{
            $pull:{ numberOfFollowers: req.user._id}
        });
        await user.save();

        return res.status(200).json({
            message : `You started unfollowing ${userId}`
        })
    } catch(err) {
        console.log(err);
    }
}






module.exports = {
    signup, 
    signin, 
    userProfile, 
    followUser, 
    unFollowUser
}
