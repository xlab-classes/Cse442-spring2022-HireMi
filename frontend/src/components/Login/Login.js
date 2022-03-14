import React from 'react';
import { GoogleLogin } from "react-google-login"
import './Login.css';
import Logo from './hiremi.jpg';


function Login() {
  return (
    <div className='backgrounds'>
      <Borders />
    </div>
  );
}

function Borders() {
  return (
    <div className='borders'>
        <PageContext />
    </div>
  );
}

function PageContext() {
  return (
    <div id='container'>
      <img 
        src={Logo} 
        alt=""
        className='row1'>
      </img>
      <h3 
        className='row2'>
        Welcome Back!
      </h3>
      <h3 
        className='row3'>
        Login
      </h3>
      <LoginButton className='row4'/>
    </div>
  );
}


function LoginButton() {

  const clientId = "515535950425-qkoa6f2on1o99chdj02nqqqu5e4kln8c.apps.googleusercontent.com";

  const handleCredentialResponse = (response) => {
    console.log(response);
    //let verified_response = 
    fetch('../backend/api/api.php/login', {
      method: 'POST',
      // mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: string_body
    }).then((result) => result.json())
      .then((resultJson) => {

        const expirationDate = new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000));
        console.log(resultJson);
        console.log(resultJson["name"]);
        console.log(resultJson["id"]);
        console.log(resultJson["pic"]);
        console.log(resultJson["email"]);
        console.log(resultJson["verified_token"]);

        document.cookie = `name=${resultJson.name}; path=/; expires=${expirationDate}`;
        document.cookie = `id=${resultJson.id}; path=/; expires=${expirationDate}`;
        document.cookie = `pic=${resultJson.pic}; path=/; expires=${expirationDate}`;
        document.cookie = `email=${resultJson.email}; path=/; expires=${expirationDate}`;
        document.cookie = `token=${resultJson.verified_token}; path=/; expires=${expirationDate}`;
      });

    //id_token is a type of jwt token
    const id_token = response['tokenObj']['id_token'];
    const json_body = { "token": id_token };
    console.log(json_body);
    const string_body = JSON.stringify(json_body);
  }; //end of handleCredentialResponse

  return (
    <div >
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google >"
          onSuccess={handleCredentialResponse}
          onFailure={handleCredentialResponse}
          cookiePolicy={'single_host_origin'}
        />
    </div>
  )
} //end of LoginButton


export default Login;

