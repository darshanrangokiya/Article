const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    googleID:{
        type:String,
        required:true,
    },
    displayname:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true,
    }
});
module.exports=mongoose.model("User",userSchema)