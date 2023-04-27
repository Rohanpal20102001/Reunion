const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName : {
        type: String
    },
    password : {
        type : String,
        minlength : 6
    },
    email : {
        type : String,
        required : true,
    },
    isAccountVerified : {
        type : Boolean,
        default : false
    },
    userBlogs : [{
        type : String
    }],
    numberOfFollowers : [{
        type : String
    }],
    numberOfFollowings : [{
        type : String
    }],
});


userSchema.methods.generateJWT = () => {
    const token = jwt.sign(
        {
            _id : this._id,
            email : this.email,
        },
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    )
}



const User = mongoose.model("User", userSchema);
module.exports = User