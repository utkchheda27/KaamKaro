const passport=require("passport");
const {Strategy}= require("passport-local");

const mockUsers = [
  { id: 1, username: "ABC", password: 123 },
  { id: 5, username: "AvdvavBC", password: 175823 },
];
const authMiddleware=passport.use(
    new Strategy((username,password,done)=>{
        console.log(username);
        console.log(password);
        try{
            const findUser=mockUsers.find((user)=>user.username===username);
            if(!findUser) throw new Error("User not found");
            if(findUser.password !=password) throw new Error("Invalid Credentials");
            done(null,findUser);
        }catch(err){
            done(err,null);
        }
    })
)

module.exports=authMiddleware;