import React, {useState, useEffect} from 'react';
import Cookies from "js-cookie";

import styles from "../Settings/Settings.module.scss";

const Settings = ({auth, setAuth}) => {

    const [username, setName] = useState(auth?.username);
    const [newName, setNewName] = useState(auth?.username);
    const [pic, setPic] = useState(auth?.pic);
    const [newPic, setNewPic] = useState(auth?.pic);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const json_body = {'id': auth?.id};
        const string_body = JSON.stringify(json_body);

        fetch('https://www-student.cse.buffalo.edu/CSE442-542/2022-Spring/cse-442r/backend/api/api.php/get_profile_info', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: string_body
        }).then((result) => result.json())
        .then((resultJson) => {
            console.log(resultJson);

            setName(resultJson.profile_name);
            setNewName(resultJson.profile_name);
            setPic(resultJson.profile_picture);
            setNewPic(resultJson.profile_picture);
        });
    }, []);

    useEffect(() => {
        if(!file) {
            setNewPic(pic);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setNewPic(btoa(reader.result));
        reader.readAsBinaryString(file);

        // setFile(selectedFile)

    }, [file]);

    function b64toBlob(b64Data, contentType='', sliceSize=512) {
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
        // Clear the input value so that the same file can be uploaded twice
        e.target.value = null;
    }

    function discardPic() {
        setNewPic(pic);
        setFile(null);
    }

    function uploadImage() {
        // Implement uploading to database through backend api with token
        setPic(newPic);

        const json_body = {'id': auth?.id, 'image': newPic};
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
            pic: newPic, // Change the profile picture
            email: auth?.email,
            access_token: auth?.access_token,
        })
    }

    function discardName() {
        setNewName(username);
    }

    function changeName() {
        setName(newName);

        const json_body = {'id': auth?.id, 'new_name': newName};
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
            username: newName, // Change the username
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
                    {/*<span>Change Photo</span>*/}
                    <img alt="profile photo" src={(newPic.length > 1000) ? URL.createObjectURL(b64toBlob(newPic)) : newPic} />
                    <input type='file' accept="image/*" onChange={onSelect}/>
                    <button className={styles['profile-btn']} onClick={uploadImage} disabled={pic === newPic}>Update</button>
                    {pic === newPic ? null : <button className={styles['profile-btn']} onClick={discardPic}>Discard Changes</button>}
                </div>
                <div className={styles['profile-info']}>
                    {/*<span>Change Name</span>*/}
                    <input type='text' defaultValue={newName} value={newName} onChange={e => setNewName(e.target.value)}/>
                    <button className={styles['profile-btn']} onClick={changeName} disabled={username === newName}>Update</button>
                    {username === newName ? null : <button className={styles['profile-btn']} onClick={discardName}>Discard Changes</button>}
                </div>
                <div>
                    <button className={`${styles['profile-btn']} ${styles['btn-delete']}`} onClick={deleteAccount}>Delete Account</button>
                </div>
            </section>
        </div>
    )
}

export default Settings;