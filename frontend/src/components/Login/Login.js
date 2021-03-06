import React, {useState} from 'react';

import {GoogleLogin} from "react-google-login"
import styles from './Login.module.scss';

import hiremi_logo from './img/hiremi.png';
import g_logo from './img/g_logo.svg';


function Login({setAuth, auth}) {
    const [isError, setError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    return (
        <div className={styles['page-root']}>
            <div className={styles['login-wrap']}>
                <img className={styles['']} src={hiremi_logo} alt="hiremi logo"/>
                <h1 className='row2'>Welcome Back!</h1>
                <LoginButton className='row4' setAuth={setAuth} auth={auth} setError={setError} setErrMsg={setErrMsg}/>
                {isError ? <p>Failed to login: {errMsg}</p> : null}
            </div>
        </div>
    );
}

function LoginButton({setAuth, auth, setError, setErrMsg}) {

    const clientId = "515535950425-qkoa6f2on1o99chdj02nqqqu5e4kln8c.apps.googleusercontent.com";

    const handleSuccess = (response) => {
        // Error handling
        if (!response) {
            return;
        }

        //id_token is a type of jwt token
        const id_token = response['tokenObj']['id_token'];
        const json_body = {"token": id_token};
        const string_body = JSON.stringify(json_body);

        try {
            fetch('./backend/api/api.php/login', {
                method: 'POST',
                // mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: string_body
            })
                .then((result) => result.json())
                .then((resultJson) => {
                    const expirationDate = new Date(new Date().getTime() + (14 * 24 * 60 * 60 * 1000));

                    document.cookie = `name=${resultJson.name}; path=/; expires=${expirationDate}`;
                    document.cookie = `id=${resultJson.id}; path=/; expires=${expirationDate}`;
                    document.cookie = `pic=${resultJson.pic}; path=/; expires=${expirationDate}`;
                    document.cookie = `email=${resultJson.email}; path=/; expires=${expirationDate}`;
                    document.cookie = `token=${resultJson.verified_token}; path=/; expires=${expirationDate}`;
                    setAuth({
                        ...auth,
                        username: resultJson.name,
                        id: resultJson.id,
                        pic: resultJson.pic,
                        email: resultJson.email,
                        access_token: resultJson.verified_token
                    })
                })
        } catch (err) {
            handleFailure(err);
        }
    }; //end of handleCredentialResponse

    const handleFailure = err => {
        setError(true);
        setErrMsg(JSON.stringify(err));
        console.error(err)
    }

    const buttonEl = (renderProps) => (
        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className={styles['button-wrap']}>
            <span className='base_text__2aTiN'>Sign in with </span>
            <img src={g_logo} alt={'google logo'}/>
        </button>
    )

    return (
        <GoogleLogin
            clientId={clientId}
            render={buttonEl}
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
        />
    )
} //end of LoginButton

export default Login;
