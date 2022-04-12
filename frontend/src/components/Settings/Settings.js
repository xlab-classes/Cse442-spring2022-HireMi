import React, {useState, useEffect} from 'react';
import Cookies from "js-cookie";

import styles from "../Settings/Settings.module.scss";

const Settings = ({auth, setAuth}) => {

    const [isEdit, setEdit] = useState(false);
    const [username, setName] = useState(auth?.username);
    const [pic, setPic] = useState((auth?.pic.length > 1000) ? URL.createObjectURL(b64toBlob(auth?.pic)) : auth?.pic);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if(!file) {
            setPic((auth?.pic.length > 1000) ? URL.createObjectURL(b64toBlob(auth?.pic)) : auth?.pic);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPic(objectUrl);
        // setFile(selectedFile)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }

    function onSelect(e) {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(null);
            return;
        }
        setFile(e.target.files[0]);
    }

    function discardPic() {
        setPic((auth?.pic.length > 1000) ? URL.createObjectURL(b64toBlob(auth?.pic)) : auth?.pic);
        setFile(null);
    }

    function changeImage() {
        const reader = new FileReader();
        reader.onload = () => uploadImage(reader.result);
        reader.readAsBinaryString(file);
    }

    function uploadImage(file_binary) {
        // Implement uploading to database through backend api with token

        const encoded_image = btoa(file_binary);
        const json_body = {'id': auth?.id, 'image': encoded_image};
        const string_body = JSON.stringify(json_body);

        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/profile_pic', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: string_body
        }).then((result) => console.log(result));

        setAuth({
            username: auth?.username,
            id: auth?.id,
            pic: encoded_image, // Change the profile picture
            email: auth?.email,
            access_token: auth?.access_token,
        })
    }

    function discardName() {
        setName(auth?.username);
    }

    function changeName() {

        const json_body = {'id': auth?.id, 'new_name': username};
        const string_body = JSON.stringify(json_body);

        // Implement changing name in database through backend api with token
        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/change_name', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: string_body
        }).then((result) => console.log(result));

        setAuth({
            username: username, // Change the username
            id: auth?.id,
            pic: auth?.pic,
            email: auth?.email,
            access_token: auth?.access_token,
        })
    }

    function deleteAccount() {
        // Implement profile deletion in database through backend api with token
        const json_body = {'id': auth?.id};
        const string_body = JSON.stringify(json_body);

        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/del_acc', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: string_body
        }).then((result) => console.log(result));

        Cookies.remove('name');
        Cookies.remove('id');
        Cookies.remove('pic');
        Cookies.remove('email');
        Cookies.remove('token');

        setAuth({
            username: "Anonymous",
            id: false,
            pic: "https://lh3.googleusercontent.com/a/AATXAJxOjQQoJshWIHJ0t67X0-fqBJzgTDMnMcCaHvqy=s96-c",
            email: "hiremi.ub@gmail.com",
            access_token: null,
        })
    }

    return (
        <div className={styles['page-root']}>
            <section className={styles['profile-sect']}>
                <h6>Account Settings</h6>
                <div className={styles['profile-pic']}>
                    <span>Change Photo</span>
                    <img alt="profile photo" src={pic}/>
                    <input type='file' accept="image/*" onChange={onSelect}/>
                    <button onClick={changeImage} disabled={pic === (auth?.pic.length > 1000) ? URL.createObjectURL(b64toBlob(auth?.pic)) : auth?.pic}>Update</button>
                    {file ? <button onClick={discardPic}>Discard Changes</button> : null}
                </div>
                <div>
                    <span>Change Name</span>
                    <input type='text' defaultValue={username} value={username} onChange={e => setName(e.target.value)}/>
                    <button onClick={changeName} disabled={username === auth?.username}>Update</button>
                    {username === auth?.username ? null : <button onClick={discardName}>Discard Changes</button>}
                </div>
                <div>
                    <button onClick={deleteAccount}>Delete Account</button>
                </div>
            </section>
        </div>
    )
}

export default Settings;