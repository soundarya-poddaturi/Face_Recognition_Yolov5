import React, {useState} from "react"
import "../App.css"
// import axios from "axios"
import { useHistory } from "react-router-dom"
import logo from './images/uploadimg.png'

const Detect = () => {
  const [selectedImage, setSelectedImage] = useState();
    
    const history = useHistory()
    const imageChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedImage(e.target.files[0]);
      }
    };
    
    
    return (
      <div style ={divStyle}>
        <div className="box">
        <div className="container">
            <p className="homepage">Want to detect ?</p>
            <div className="button"onClick={() => history.push("/upload")}>Click here</div>
            
            <p className="homepage">Or want to return back ?</p>
             <p  className="link" onClick={() =>history.push("/login")}> Home</p>
        </div>
        </div>

    </div>
    )
}

export default Detect
const divStyle = {
  width: "100%",
  height: "100vh",
  background: `url(${logo})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};