const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment : {
        type : String,
    },
    userId : {
        type : String
    }
})


const postSchema = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    title : {
        type : String
    },
    description : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    comments: [commentSchema],
    like : [{
        userId : String
    }],
    unlike : [{
        userId : String
    }],
});


const Post = mongoose.model("Post", postSchema);
module.exports = Post;