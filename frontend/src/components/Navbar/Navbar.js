import React from "react";
import {useEffect, useState} from "react";

import {NavLink} from "react-router-dom";
import {ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_BUILDER, ROUTE_SETTINGS} from "../../constants/routes";

import './Navbar.scss'

const Navbar = (props) => {

    const [isActive, setActive] = useState(false)

    useEffect(() => {

        return function cleanup() {

        }
    }, []);

    // useEffect(() => {
    //
    // }, [isActive])

    return (
        <nav className={isActive ? "nav-bar active" : "nav-bar"}>
            <button onClick={() => {setActive(prevState => !prevState)}}>Test</button>
            <NavLink to={ROUTE_LOGIN}>Login</NavLink>
            <NavLink to={ROUTE_DASHBOARD} >Dashboard</NavLink>
            <NavLink to={ROUTE_BUILDER}>Resume Builder</NavLink>
            <NavLink to={ROUTE_SETTINGS}>Settings</NavLink>
        </nav>
    )
}

export default Navbar;
