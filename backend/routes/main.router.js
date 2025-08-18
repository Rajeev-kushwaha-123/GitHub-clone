const express=require("express");
const mainRouter=express.Router();
const userRouter=require('./user.router');
const repoRouter=require('./repo.router');
const issueRouter=require('./issue.router');
const gitRouter=require('./git.router');

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use('/git', gitRouter);

mainRouter.get('/',(req,res)=>{
    res.send('Welcome to the main page');
});

module.exports=mainRouter;
