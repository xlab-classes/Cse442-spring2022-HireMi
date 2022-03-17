import React from "react";
import {useEffect, useState} from "react";

import {NavLink} from "react-router-dom";
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

const UnprotectedLinks = () => {
    return (
        <>
            <NavLink to={ROUTE_LOGIN}>Login</NavLink>
        </>
    )
}

const Navbar = ({id}) => {


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
            <div>
                {id ? <ProtectedLinks /> : <UnprotectedLinks />}
            </div>
            {/*<button onClick={() => {*/}
            {/*    setActive(prevState => !prevState)*/}
            {/*}}>Temp*/}
            {/*</button>*/}
        </nav>
    )
}

export default Navbar;
