const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add more fields as needed
  repositories:[
    {
        default:[],
        type: Schema.Types.ObjectId,
        ref: 'Repository',
    },
  ],
  followedUsers:[
    {
        default:[],
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
  ],
  starRepos:[
    {
        default:[],
        type: Schema.Types.ObjectId,
        ref: 'Repository',
    },
  ],
},
 
{
  timestamps: true, // adds createdAt and updatedAt fields
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
