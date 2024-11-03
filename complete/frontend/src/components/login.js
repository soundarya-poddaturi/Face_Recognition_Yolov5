import React, {useState} from "react"
import "../App.css"
import axios from "axios"
import { useHistory } from "react-router-dom"
import logo from './images/loginimg.png';

const Login = ({ setLoginUser}) => {

    const history = useHistory()

    const [ user, setUser] = useState({
        email:"",
        password:""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
        axios.post("http://localhost:9002/login", user)
        .then(res => {
            if(res.data.message === "Login Successfully")
            {
                alert(res.data.message)
                history.push("/detect")
                setLoginUser(res.data.user)    
            }
            else
            {
                history.push("/login")
                alert(res.data.message)
            }
        })
    }

    return (
        <div className="full" style ={HeaderStyle}> 
        <header id="text">FACE RECOGNITION</header>

        <div className="box">
            <div className="container">
             <h1 className="head">Login</h1>
             <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
             <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Enter your Password" />
             <br/>
             <center><div className="button" onClick={login}>Login</div></center>
             <p className="homepage">Not a member ?</p>
             <p  className="link" onClick={() =>history.push("/register")}>Create an account</p>
         </div> 
         </div>
         </div>
    )
}

export default Login
const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${logo})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    
  };

