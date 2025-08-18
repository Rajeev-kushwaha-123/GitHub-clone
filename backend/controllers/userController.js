const jwt =require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient}=require('mongodb');
const dotenv=require('dotenv');
var ObjectId=require('mongodb').ObjectId;
dotenv.config();

const uri=process.env.MONGODB_URI;
let client;

async function connectClient(){
      if (!client){
        client = new MongoClient(uri,
            {useNewUrlParser:true,
             useUnifiedTopology:true
            });
      await client.connect();
      }
}

const signup= async (req,res)=>{
    const {username,email,password}=req.body;
    try{
        await connectClient();
        const db=client.db('githubclone');
        const usersCollection=db.collection('users');

        const User=await usersCollection.findOne({username});    
        if(User){
            return res.status(400).json({msg:'User already exists'});
            }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);
        const newUser={
            username,
            email,
            password:hashedPassword,
            repositories:[],
            followedUsers:[],
            starRepos:[]
        };
        const result=await usersCollection.insertOne(newUser);
        // Generate JWT token
        const token = jwt.sign(
            { id: result.insertedId }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" } 
        );
        res.json({token,userId:result.insertedId});
    }catch(err){
        console.error("Error during signup",err.message);
        res.status(500).json({msg:"Internal server error"});
    }
};

const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        await connectClient();
        const db=client.db('githubclone');
        const usersCollection=db.collection('users');
         const User=await usersCollection.findOne({email});    
        if(!User){
            return res.status(400).json({msg:'invalid credentials'});
        }
        const isValidPassword=await bcrypt.compare(password,User.password);
        if(!isValidPassword){
            return res.status(400).json({msg:'invalid credentials'});
        }
        const token = jwt.sign(
            { id: User._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3h" }
            );
        res.json({token,userId:User._id});
    }catch(err){
        console.error("Error during login:",err.message);
        res.status(500).json({msg:"Internal server error"});
    }
};

const getAllUsers=async (req,res)=>{
    try{
        await connectClient();
        const db=client.db('githubclone');
        const usersCollection=db.collection('users');
        const users=await usersCollection.find({}).toArray();
        res.json(users);
    }catch(err){
        console.error("Error during getting all users:",err.message);
        res.status(500).json({msg:"Internal server error"});
    }
};


const getUserProfile=async (req,res)=>{
    const currentID=req.params.id;
    try{
        await connectClient();
        const db=client.db('githubclone');
        const usersCollection=db.collection('users');
        const user=await usersCollection.findOne({
            _id:new ObjectId(currentID)
        });
        if(!user){
            return res.status(400).json({msg:'invalid credentials'});
        }
    res.send(user);

    }
    catch(err){
        console.error("Error during getting user profile:",err.message);
        res.status(500).json({msg:"Internal server error"});
    }
};

const updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    try {
        await connectClient();
        const db = client.db('githubclone');
        const usersCollection = db.collection('users');

        // Prepare update object
        let updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "Profile updated successfully" });
    } catch (err) {
        console.error("Error updating user profile:", err.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const deleteUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        await connectClient();
        const db = client.db('githubclone');
        const usersCollection = db.collection('users');

        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "Profile deleted successfully" });
    } catch (err) {
        console.error("Error deleting user profile:", err.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

module.exports={
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}