import React from 'react';
import { GoogleLogin } from "react-google-login"
import './Login.css';
import Logo from './hiremi.png';


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
        // console.log(resultJson);
        // console.log(resultJson["name"]);
        // console.log(resultJson["id"]);
        // console.log(resultJson["pic"]);
        // console.log(resultJson["email"]);
        // console.log(resultJson["verified_token"]);

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
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className='buttonClass'>
              {/*<span className='base_iconWrapper__3k0lf'>*/}
              {/*  <svg width="25" height="25" viewBox="0 0 16 16" fill="none" transform='translate(-35, 1.7)'>*/}
              {/*    <g clip-path="url(#clip0)">*/}
              {/*      <path d="M16.0008 8.17753C16.0008 7.51976 15.9463 7.03976 15.8285 6.54199H8.16406V9.51085H12.6629C12.5722 10.2486 12.0824 11.3598 10.994 12.1064L10.9787 12.2058L13.4021 14.0456L13.5699 14.062C15.1119 12.6664 16.0008 10.6131 16.0008 8.17753Z" fill="#4285F4">*/}
              {/*      </path>*/}
              {/*      <path d="M8.1636 15.9999C10.3676 15.9999 12.218 15.2887 13.5695 14.0621L10.9935 12.1065C10.3042 12.5776 9.37899 12.9065 8.1636 12.9065C6.00489 12.9065 4.17272 11.5109 3.5196 9.58203L3.42386 9.59L0.904047 11.5011L0.871094 11.5909C2.21348 14.2042 4.97084 15.9999 8.1636 15.9999Z" fill="#34A853">*/}
              {/*      </path>*/}
              {/*      <path d="M3.52021 9.5824C3.34788 9.08463 3.24815 8.55126 3.24815 8.00017C3.24815 7.44903 3.34788 6.91572 3.51115 6.41795L3.50658 6.31193L0.95518 4.37012L0.871703 4.40903C0.31844 5.49349 0.000976562 6.71129 0.000976562 8.00017C0.000976562 9.28906 0.31844 10.5068 0.871703 11.5913L3.52021 9.5824Z" fill="#FBBC05">*/}
              {/*      </path>*/}
              {/*      <path d="M8.16364 3.09331C9.6965 3.09331 10.7305 3.7422 11.3201 4.28446L13.6239 2.08C12.209 0.791114 10.3677 0 8.16364 0C4.97087 0 2.21349 1.79554 0.871094 4.40885L3.51054 6.41777C4.17274 4.48888 6.00492 3.09331 8.16364 3.09331Z" fill="#EB4335">*/}
              {/*      </path>*/}
              {/*    </g>*/}
              {/*    <defs>*/}
              {/*      <clipPath id="clip0">*/}
              {/*        <rect width="16" height="16" fill="white"></rect>*/}
              {/*      </clipPath>*/}
              {/*    </defs>*/}
              {/*  </svg>*/}
              {/*</span>*/}
              {/*<span className='base_text__2aTiN'>*/}
              {/*      Sign in with Google*/}
              {/*</span>*/}
              {/*<span className="base_iconWrapper__3k0lf">*/}
              {/*  <svg width="8" height="12" viewBox="0 0 8 12" fill="none"*/}
              {/*       xmlns="http://www.w3.org/2000/svg"*/}
              {/*       transform='translate(35, -4)'>*/}
              {/*    <path d="M1 0.5L6.5 6L1 11.5" stroke="currentColor" stroke-linecap="round"></path>*/}
              {/*  </svg>*/}
              {/*</span>*/}
            </button>
          )}
          buttonText="Sign in with Google >"
          onSuccess={handleCredentialResponse}
          onFailure={handleCredentialResponse}
          cookiePolicy={'single_host_origin'}
        />
    </div>
  )
} //end of LoginButton


export default Login;

