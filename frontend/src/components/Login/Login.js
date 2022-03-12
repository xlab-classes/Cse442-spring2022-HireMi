import { React, useEffect } from 'react';
import GoogleLogin from 'react-google-login';

const Login = (props) => {

    const handleCredentialResponse = async (response) => {
        console.log(response)

        //id_token is a type of jwt token
        const id_token = response['tokenObj']['id_token']
        
        const json_body = {"token": id_token};
        console.log(json_body);
        const string_body = JSON.stringify(json_body);

        //let verified_response = 
        fetch('../backend/api/api.php/login',{
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: string_body
        }).then((result) => result.json())
        .then((resultJson) => {

            const expirationDate = new Date(new Date().getTime()+(14*24*60*60*1000));
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

        


        // window.location.reload()
    }

    return (
        <div className="Login">
            <div style={{color: "blue", fontSize: "5rem"}}>Login</div>
            <GoogleLogin
                clientId="515535950425-qkoa6f2on1o99chdj02nqqqu5e4kln8c.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={handleCredentialResponse}
                onFailure={handleCredentialResponse}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default Login;
