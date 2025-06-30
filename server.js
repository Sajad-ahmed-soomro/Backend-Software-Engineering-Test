const express=require('express')
const app=express();
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

app.use(express.json());
const Port=3000;

// for demontstation purpose I have written secret here but it should be in .env file for safety
const secret='1498789hjadfsakjls8'

let users=[];

app.post('/register',async(req,res)=>{
    const{username,password}=req.body;
    //error handling 
    if(!username || !password){
        return res.json("Please enter required credentials");
    }
    if(users.find(user=>user.username===username)){
        return res.json("user already registered")
    }
    
    const hashpassword=await bcrypt.hash(password,10);
    users.push({username,password:hashpassword});
    res.status(201).json("User successfully registered")
    


})

app.post("/login",async(req,res)=>{
    const{username,password}=req.body;
    //error handling 
    if(!username || !password){
        return res.json("Please enter required credentials");
    }
    const user=users.find(user=>user.username===username);
    if(!user) return  res.json("Invalid Credentials")
    const matchpasword=await bcrypt.compare(password,user.password);
    if(!matchpasword) res.json("Invalid credentials");

    const token=jwt.sign({username},secret,{expiresIn:'15min'});
    res.json({token});    
    
})

const auth=(req,res,next)=>{
    const Auth=req.headers['authorization'];
    const token=Auth.split(' ')[1]

    if(!token) return res.sendStatus(401)
    jwt.verify(token,secret,(err,user)=>{
        if(err)res.sendStatus(403);
        req.user=user;
        next();
    })

}
app.get("/get",auth,(req,res)=>{
    
    res.json({user:req.user})
})

app.listen(Port,()=>{
    console.log(`App is listening at ${Port} `)
})