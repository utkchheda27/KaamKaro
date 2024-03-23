const passport=require("passport");
const {Strategy}= require("passport-local");
const {mockUsers}=require("gg/fd.js");

passport.use(
    new Strategy((username,password,done)=>{
        try{
            const findUser=Users.find((user)=>user.username===username);
            if(!findUser) throw new Error("User not found");
            if(findUser.password !=password) throw new Error("Invalid Credentials");
            done(null,findUser);
        }catch(err){
            done(err,null);
        }
    })
)