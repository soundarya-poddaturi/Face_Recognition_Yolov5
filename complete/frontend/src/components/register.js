import React, { useState } from "react"
import "../App.css"
import axios from "axios"
import logo from './images/registerimg.png';

import { useHistory } from "react-router-dom"

const Register = () => {

    const history = useHistory()
    

    const [ user, setUser] = useState({
        name: "",
        email:"",
        password:"",
        reEnterPassword: ""
    })

    const handleChange = e => {
        const { name, value } = e.target  
        setUser({
            ...user,
            [name]: value
        })
    }
 
    const register = () => {
        const { name, email, password, reEnterPassword } = user
        if( name && email && password && (password === reEnterPassword)){
            axios.post("http://localhost:9002/register", user) //sending to backend
            .then( res => {
                if(res.data.message==="Successfully Registered, Please login now.")
                {
                    alert(res.data.message)
                    history.push("/login")

                }
                else{
                    history.push("/register")
                    alert(res.data.message)
                }
            })
        } else {
            alert("invlid input") 
        }
        
    }

    return (
    
        <div  style ={HeaderStyle}>
        <div className="box">
        <div className="container">
            {console.log("User", user)}
            <h1  className="head">Register</h1>
            <input type="text" name="name" value={user.name} placeholder="Your Name" onChange={ handleChange }></input>
            <input type="email" name="email" value={user.email} placeholder="Your Email" onChange={ handleChange }></input>
            <input type="password" name="password" value={user.password} placeholder="Your Password" onChange={ handleChange }></input>
            <input type="password" name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password" onChange={ handleChange }></input>
            <div className="button" onClick={register} >Register</div>
            <p  className="link" onClick={() =>history.push("/login")}>Go Back</p>

        </div>
        </div>
        </div>
        
    )
}

export default Register
const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${logo})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };


