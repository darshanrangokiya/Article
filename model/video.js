const mongoose=require('mongoose')
const videoSchema=mongoose.Schema({
    vname:{
        type:String,
        required:true,
    },
    video:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    }
})
module.exports=mongoose.model('Video',videoSchema);
