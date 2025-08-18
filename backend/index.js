const express=require("express");
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose = require('mongoose');
const bodyParser=require("body-parser");
const http=require("http");
const {Server}=require("socket.io");
const mainRouter=require('./routes/main.router')

dotenv.config();

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("start","starts a new server",{},startServer)
  .command("init", "initialize a new repository", () => {}, initRepo)
  .command(
    "add <file>",
    "add a file to the staging area",
    (yargs) => {
      yargs.positional("file", {
        describe: "file to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "commit staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "push commits to remote", () => {}, pushRepo)
  .command("pull", "pull latest changes from remote", () => {}, pullRepo)
  .command(
    "revert <commitId>",
    "revert to a specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitId);
    }
  )
  .demandCommand(1)
  .help().argv;

  
function startServer(){
  const app=express();
  const port = process.env.PORT || 3002;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors({origin:"*"}));
  app.use(express.json());

  const mongoURI= process.env.MONGODB_URI;
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

  app.get("/",(req,res)=>{
    res.send("Welcome to the API");
  });

  app.use("/",mainRouter);
   
  let user='test';
  const httpServer=http.createServer(app);
  const io=new Server(httpServer,{
    cors:{
      origin:"*",
      methods:["GET","POST"],
      credentials:true
      },
  });
  io.on("connection",(socket)=>{
    socket.on("joinRoom",(userID)=>{
      user=userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    })
  });
  
  const db=mongoose.connection;
  db.once("open",async()=>{
    console.log("CRUD OPERATIONS CALLED");
  });

  httpServer.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
  });
}