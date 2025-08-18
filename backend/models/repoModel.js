const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const RepositorySchema=new Schema({
    name: { type: String, 
           required: true,
           unique: true
     },
     description: { 
        type: String
     },
     content: [
         {
             type: Schema.Types.Mixed,
         }
     ],
     visibility:{
        type:Boolean,
     },
    owner :{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    collaborators:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    issues:[
        {
            type:Schema.Types.ObjectId,
            ref:"Issue",
        }
    ] 
})
const Repository=mongoose.model("Repository",RepositorySchema);

module.exports=Repository;