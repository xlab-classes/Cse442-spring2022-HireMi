import React, { Component } from "react";
import axios from 'axios';

class Settings extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
        name:null,
        file: null
    }
    this.onChangeImg = this.onChangeImg.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
}

onChangeImg(event) {
    this.setState({
        name: URL.createObjectURL(event.target.files[0]),
        file: event.target.files[0]
    })
}

uploadImage(){
    const formData =  new FormData();
    formData.append('image', this.state.file);
    let url = "../backend/api/api.php/login";
    axios.post(url, formData, {
    })
    .then(res => {
        console.log(res.data);
    })

}

render() {
    let preview;
    if (this.state.name) {
        preview = <img src={this.state.name} alt='File preview' />;
    }
    return (
        <>
            <div>
                {preview}
            </div>

            <form>
                <input type="file" name="image" onChange={this.onChangeImg} />

                <button type="button" onClick={this.uploadImage}>Upload</button>
            </form>
        </>
    )
}
}

export default Settings;