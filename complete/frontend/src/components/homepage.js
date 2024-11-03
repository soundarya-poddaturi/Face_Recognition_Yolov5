import React from "react"

import logo from './images/loginimg.png';

const Homepage = ({setLoginUser}) => { 
    return (
        <header style ={HeaderStyle} >
        <div className="box">
        <div className="homepage" >

            <h1>Thank you</h1>
            <br/>
            <div className="button"  onClick={() => setLoginUser({})} >Logout</div>
        </div>
        </div>
        </header>
    )
}  

export default Homepage
const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${logo})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    
  };
