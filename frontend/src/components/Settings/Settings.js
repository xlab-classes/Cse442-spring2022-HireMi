import React, {useState, useEffect} from 'react';
import Cookies from "js-cookie";

import styles from "../Settings/Settings.module.scss"

const Settings = ({auth, setAuth}) => {

    const [isEdit, setEdit] = useState(false)
    const [username, setName] = useState(auth?.username)
    const [pic, setPic] = useState(auth?.pic)
    const [file, setFile] = useState(null);

    useEffect(() => {
        if(!file) {
            setPic(auth?.pic)
            return;
        }
        const objectUrl = URL.createObjectURL(file)
        setPic(objectUrl)
        // setFile(selectedFile)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    function onSelect(e) {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(null)
            return
        }
        setFile(e.target.files[0])
    }

    function discardPic() {
        setPic(auth?.pic)
        setFile(null)
    }

    function discardName() {
        setName(auth?.username)
    }

    function deleteAccount() {
        // Add API that does it

        Cookies.remove('name')
        Cookies.remove('id')
        Cookies.remove('pic')
        Cookies.remove('email')
        Cookies.remove('token')

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
                    <button onClick={null} disabled={pic === auth?.pic}>Update</button>
                    {file ? <button onClick={discardPic}>Discard Changes</button> : null}
                </div>
                <div>
                    <span>Change Name</span>
                    <input type='text' defaultValue={username} value={username} onChange={e => setName(e.target.value)}/>
                    <button onClick={null} disabled={username === auth?.username}>Update</button>
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
