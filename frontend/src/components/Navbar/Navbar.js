import React from "react";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

import {NavLink} from "react-router-dom";
import {ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_BUILDER, ROUTE_SETTINGS} from "../../constants/routes";

import './Navbar.scss'

const Navbar = (props) => {

    // this.state = {
    //     username: (Cookies.get("username") == undefined)? "Anonymous" : Cookies.get("username"),
    //     id: (Cookies.get("id") == undefined)? "-1" : Cookies.get("id"),
    //     pic: (Cookies.get("pic") == undefined)? "https://lh3.googleusercontent.com/a/AATXAJxOjQQoJshWIHJ0t67X0-fqBJzgTDMnMcCaHvqy=s96-c" : Cookies.get("pic"),
    //     email: (Cookies.get("email") == undefined)? "hiremi.ub@gmail.com" : Cookies.get("email"),
    // }

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
