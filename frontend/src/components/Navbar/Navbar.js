import React from "react";
import {useState, useEffect} from "react";

import {NavLink, useLocation} from "react-router-dom";
import {ROUTE_BUILDER, ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_SETTINGS} from "../../constants/routes";

import styles from './Navbar.module.scss'


const Navbar = ({auth}) => {
    const [isActive, setActive] = useState(false);
    const [username, setName] = useState(auth?.username);
    const [pic, setPic] = useState(auth?.pic);
    const [nameCounter, setNameCounter] = useState(0);
    const [picCounter, setPicCounter] = useState(0);

    const {pathname} = useLocation();

    useEffect(() => {
        const json_body = {'id': auth?.id};
        const string_body = JSON.stringify(json_body);

        fetch('./backend/api/api.php/get_profile_info', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: string_body
        }).then((result) => result.json())
        .then((resultJson) => {
            // console.log(resultJson);

            setName(resultJson.profile_name);

            const count = nameCounter;
            setNameCounter(count + 1);
        });
    }, [auth?.username]);

    useEffect(() => {
        const json_body = {'id': auth?.id};
        const string_body = JSON.stringify(json_body);

        fetch('./backend/api/api.php/get_profile_info', {
            method: 'POST',
            // mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.access_token
            },
            body: string_body
        }).then((result) => result.json())
        .then((resultJson) => {
            // console.log(resultJson);

            setPic(resultJson.profile_picture);

            const count = picCounter;
            setPicCounter(count + 1);
        });
    }, [auth?.pic]);

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

    return (
        <>
            {auth?.id ?
                <nav className={isActive ? `${styles['nav-bar']} ${styles.active}` : styles["nav-bar"]}>
                    <div className={styles['nav-contents']}>
                        <div className={styles['user-info']}>
                            <NavLink className={styles['nav-link']} to={ROUTE_SETTINGS}>
                                <img src={(picCounter > 1) ? ((auth?.pic.length > 1000) ? URL.createObjectURL(b64toBlob(auth?.pic)) : auth?.pic) : ((pic.length > 1000) ? URL.createObjectURL(b64toBlob(pic)) : pic)} alt={''} />
                            </NavLink>
                            <span>{(nameCounter > 1) ? auth?.username : username}</span>
                        </div>
                        <button className={styles['toggle-btn']} onClick={() => setActive(prevState => !prevState)}>
                            <span />
                            <span />
                            <span />
                        </button>
                        {isActive ?
                            <ul className={styles['nav-drop']}>
                                {pathname === ROUTE_DASHBOARD ? <NavLink onClick={() => setActive(false)} to={ROUTE_SETTINGS}>Settings</NavLink> : null}
                                {pathname === ROUTE_SETTINGS ? <NavLink onClick={() => setActive(false)} to={ROUTE_DASHBOARD}>Dashboard</NavLink> : null}
                                {/*<NavLink to={ROUTE_BUILDER}>Resume Builder</NavLink>*/}
                            </ul>
                            :
                            null
                        }
                    </div>
                </nav>
                :
                null
            }
        </>

    )
}

export default Navbar;
