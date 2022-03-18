import React from "react";
import {useEffect, useState} from "react";

import {NavLink, useLocation} from "react-router-dom";
import {ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_SETTINGS} from "../../constants/routes";

import styles from './Navbar.module.scss'

const ProtectedLinks = () => {
    return (
        <>
            <NavLink to={ROUTE_DASHBOARD}>Dashboard</NavLink>
            <NavLink to={ROUTE_SETTINGS}>Settings</NavLink>
        </>
    )
}

const Navbar = ({auth}) => {
    const [isActive, setActive] = useState(false)

    const {pathname} = useLocation();

    return (
        <>
            {auth?.id ?
                <nav className={isActive ? `${styles['nav-bar']} ${styles.active}` : styles["nav-bar"]}>
                    <div className={styles['nav-contents']}>
                        <div className={styles['user-info']}>
                            <NavLink className={styles['nav-link']} to={ROUTE_SETTINGS}>
                                <img src={auth?.pic}/>
                            </NavLink>
                            <span>{auth?.username}</span>
                        </div>
                        <button className={styles['toggle-btn']} onClick={() => setActive(prevState => !prevState)}>
                            <span />
                            <span />
                            <span />
                        </button>
                        {isActive ?
                            <ul className={styles['nav-drop']}>
                                {pathname === ROUTE_DASHBOARD ? <NavLink to={ROUTE_SETTINGS}>Settings</NavLink> : null}
                                {pathname === ROUTE_SETTINGS ? <NavLink to={ROUTE_DASHBOARD}>Dashboard</NavLink> : null}
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
