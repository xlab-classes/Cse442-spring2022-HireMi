import React from "react";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

import {NavLink} from "react-router-dom";
import {ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_BUILDER, ROUTE_SETTINGS} from "../../constants/routes";

import styles from './Navbar.module.scss'

const Navbar = ({auth}) => {


    const [isActive, setActive] = useState(false)

    useEffect(() => {

        return function cleanup() {

        }
    }, []);

    // useEffect(() => {
    //
    // }, [isActive])

    return (
        <nav className={isActive ? `${styles['nav-bar']} ${styles.active}` : styles["nav-bar"]}>
            {/*The actual navbar won't have Link*/}
            <div>
                <NavLink to={ROUTE_LOGIN}>Login</NavLink>
                <NavLink to={ROUTE_DASHBOARD}>Dashboard</NavLink>
                <NavLink to={ROUTE_BUILDER}>Resume Builder</NavLink>
                <NavLink to={ROUTE_SETTINGS}>Settings</NavLink>
            </div>
            <button onClick={() => {
                setActive(prevState => !prevState)
            }}>Temp
            </button>
        </nav>
    )
}

export default Navbar;
