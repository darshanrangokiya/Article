const mongoose=require('mongoose')
mongoose.connect(process.env.mongodb_link)
.then(()=>console.log("Mongodb is connected"))
.catch((e)=>console.log(e))