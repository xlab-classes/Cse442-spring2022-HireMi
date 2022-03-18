import React, { useState } from 'react';
import { Buffer } from 'buffer';

const Settings = ({auth}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [tempName, setTempName] = useState(''); // Name stored as it is typed
    const [name, setName] = useState(''); // User's final name submitted

    function uploadImage(event) {
        event.preventDefault(); // Prevent page from refreshing after submit

        // Implement uploading to database through backend api with token
        const json_body = {'id': auth?.id, 'image': Buffer.from(setSelectedImage, 'base64')};
        const string_body = JSON.stringify(json_body);

        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/save_profile_pic', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': auth?.access_token
            },
            body: string_body
        }).then((result) => result.json())
            .then((resultJson) => {
                console.log(resultJson);
            });
    }

    function changeName(event) {
        setName(tempName);
        event.preventDefault();

        const json_body = {'id': auth?.id, 'new_name': name};
        const string_body = JSON.stringify(json_body);

        // Implement changing name in database through backend api with token
        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/save_name', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': auth?.access_token
            },
            body: string_body
        }).then((result) => result.json())
            .then((resultJson) => {
                console.log(resultJson);                
            });
    }

    function deleteAccount(event) {
        // Implement profile deletion in database through backend api with token
        const json_body = {'id': auth?.id};
        const string_body = JSON.stringify(json_body);

        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/del_acc', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': auth?.access_token
            },
            body: string_body
        }).then((result) => result.json())
            .then((resultJson) => {
                console.log(resultJson);                
            });
    }

    return (
        <div>
            <div style={{color: 'blue', fontSize: '5rem'}}>Settings</div>
            {selectedImage && (
                <div>
                    <img width='256' height='256' alt='not found' src={URL.createObjectURL(selectedImage)} />
                </div>
            )}

            <br />
     
            <br />

            <div>
                <p>Change profile picture: </p>
                <form onSubmit={uploadImage}>
                <input 
                    type='file' 
                    name='profPic' 
                    onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                    }}/>
                <input type='submit' value='Upload' />
                </form>
            </div>

            <br />
     
            <br />

            <div>
                <p>Name: {name}</p>
                <form onSubmit={changeName}>
                    <label>
                        Change Name:
                        <input type='text' value={tempName} onChange={(e) => setTempName(e.target.value)} />
                    </label>
                    <input type='submit' value='Submit' />
                </form>
            </div>

            <br />
     
            <br />

            <div>
                <button type='button' onClick={deleteAccount}><b>Delete Account</b></button>
                <p><b>WARNING!</b> Deleting your account will permanently erase all of your account 
                information including all created or saved resumes and templates. This action is irreversible.</p>
            </div>

        </div>
  );
};

export default Settings;