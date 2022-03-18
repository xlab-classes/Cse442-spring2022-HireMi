import React, { useState } from "react";

const Settings = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [tempName, setTempName] = useState(""); // Name stored as it is typed
    const [name, setName] = useState("My Name"); // User's final name submitted

    function uploadImage(event) {
        event.preventDefault();
        // Implement uploading to database through backend api with token
    }

    function changeName(event) {
        setName(tempName);
        event.preventDefault();
        // Implement changing name in database through backend api with token
    }

    function deleteProfile(event) {
        // Implement profile deletion in database through backend api with token
    }

    return (
        <div>
            <div style={{color: "blue", fontSize: "5rem"}}>Settings</div>
            {selectedImage && (
                <div>
                    <img width="256" height="256" alt="not found" src={URL.createObjectURL(selectedImage)} />
                </div>
            )}

            <br />
     
            <br />

            <div>
                <p>Change profile picture: </p>
                <form onSubmit={uploadImage}>
                <input 
                    type="file" 
                    name="profPic" 
                    onChange={(event) => {
                        console.log(event.target.files[0]);
                        setSelectedImage(event.target.files[0]);
                    }}/>
                <input type="submit" value="Upload" />
                </form>
            </div>

            <br />
     
            <br />

            <div>
                <p>Name: {name}</p>
                <form onSubmit={changeName}>
                    <label>
                        Change Name:
                        <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>

            <br />
     
            <br />

            <div>
                <button type="button" onClick={deleteProfile}><b>Delete Account</b></button>
                <p><b>WARNING!</b> Deleting your account will permanently erase all of your account 
                information including all created or saved resumes and templates. This action is irreversible.</p>
            </div>

        </div>
  );
};

export default Settings;