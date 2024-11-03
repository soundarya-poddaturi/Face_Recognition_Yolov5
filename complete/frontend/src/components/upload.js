import React, {useState} from "react"
import "../App.css"
// import axios from "axios"
import { useHistory } from "react-router-dom"
import logo from './images/uploadimg.png'

const Upload = () => {


  const [selectedFile, setSelectedFile] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const history = useHistory()
      const [file, setFile] = useState();
      const[output,setOutput]=useState();
      const[name,setName]=useState();
      
    const changeHandler = (event) => {
        setFile(URL.createObjectURL(event.target.files[0]));
        console.log(event.target.files[0])
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };
    
    const handleSubmit = event => {
      event.preventDefault();
      const formData2 = new FormData();
      formData2.append(
        "file",
        selectedFile,
        selectedFile.name
      );
      
    const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'multipart/form-data' }, // DO NOT INCLUDE HEADERS
        body: formData2
    };
      fetch('http://localhost:8000/object-to-img', requestOptions)
        .then(response =>  response.json())
        .then(function (response) {
          console.log('response')
          
          var encode_image = JSON.parse(response.img.body)['image'];
          var image = new Image();
          setOutput('data:image/png;base64,' + encode_image);

          setName(response.result)
            });
    }
    return (  <div className="full" style ={divStyle} >
      <div ><button className="btn btn-danger" onClick={() =>history.push("/")}>Logout</button></div>
      <div className="container  xy">
        <form onSubmit={handleSubmit}>
          <h2 className="head">ADD IMAGE</h2>
          <fieldset>
              <input className="uploadinp" name="image" type="file" onChange={changeHandler} accept=".jpeg, .png, .jpg"/>
          </fieldset>
          <button className="det" type="submit">detect</button>
        </form>
      </div>
      <br/>
      

  <div class="row">
  <div class="col-sm-6 ">
      <div class="card p-3 mb-2 bg-transparent text-dark border-0">
        <div class="card-body">
          <img className="card-img-top " src={file} />
        </div>
      </div>
    </div>
    <div class="col-sm-6 ">
      <div class="card p-3 mb-2 bg-transparent text-dark border-0">
        <div class="card-body">
          <img className="card-img-top " src={output} />
          <h2 class="card-text result">{name}</h2>
        </div>
      </div>
    </div>
  </div>
</div>
    
  );
}

export default Upload
const divStyle = {
  width: "100%",
  height: "100vh",
  background: `url(${logo})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};
