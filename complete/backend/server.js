import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();  // Load .env file
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {   //registration is database name 
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    console.log(req.body) //it has all d details
    
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfully", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body   //taking from frontend
    User.findOne({email: email}, (err, user) => {   
        if(user){
            res.send({message: "User already registerd"})
        } 
        else {
            console.log(req.body)
            let pattern=/\w+@\w+\.\w+/
            let result = email.match(pattern)
            if (!result) {
                console.log('The email is invalid.')
                res.send({message:"invalid email"})
            }
            else if(name.search(/[0-9]/)!=-1)
            {
                res.send({message:"Name should not contain digits"});
                console.log("invalid name")
            }
            else if(password.length<8 || password.length>12 ||password.match(/[0-9]/)==null||password.match(/[a-z]/)==null||password.match(/[A-Z]/)==null||password.match(/\W/).length<1)
                {
                    console.log("invalid password")
                    res.send({message:"Password should contain atleast one special character , captial letter ,minimum of 8 and maximum of 12 letters and digit"})
                }
            else{
                const user = new User({     //new schema
                    name,   //schema name   name: name
                    email,
                    password
                    
                })
                user.save(err => {    //saves datAbase
                    if(err) {
                       
                        res.send(err)
                    } else {
                        console.log(user+" user")
                        res.send( { message: "Successfully Registered, Please login now." })
                    }
                })
            }

        }
    })
    
}) 
const imgSchema = new mongoose.Schema({
    name: String,

})

const imginfo = new mongoose.model("imginfo", imgSchema)

app.post('/upload',(req,res)=>
{
    console.log(req.body);
    const{pic}=req.body
    const img=new imginfo({name:pic})
    img.save(err => {    //saves datAbase
        if(err) {
            res.send(err)
        } else {
            res.send( { message: "uploaded" })
        }
    })
    console.log(img)
    // console.log(req.body) 
})


app.listen(9002,() => {
    console.log("BE started at port 9002")
})





