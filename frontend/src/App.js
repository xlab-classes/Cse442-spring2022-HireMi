import styles from './App.module.scss';
import Cookies from "js-cookie";

import React, {useState, useEffect} from "react";
import {Routes, Route} from 'react-router-dom';

import {ROUTE_LOGIN, ROUTE_DASHBOARD, ROUTE_BUILDER, ROUTE_SETTINGS} from "./constants/routes";

import Navbar from "./components/Navbar/Navbar";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Builder from "./components/Builder/Builder";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/NotFound/NotFound";

function App() {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        setAuth({
            username: (Cookies.get("username") == undefined) ? "Anonymous" : Cookies.get("username"),
            id: (Cookies.get("id") == undefined) ? "-1" : Cookies.get("id"),
            pic: (Cookies.get("pic") == undefined) ? "https://lh3.googleusercontent.com/a/AATXAJxOjQQoJshWIHJ0t67X0-fqBJzgTDMnMcCaHvqy=s96-c" : Cookies.get("pic"),
            email: (Cookies.get("email") == undefined) ? "hiremi.ub@gmail.com" : Cookies.get("email"),
        })

    }, []);

    return (
        <div className={styles['app-root']}>
            <Navbar auth={auth} />
            <Routes>
                <Route path={ROUTE_LOGIN} element={<Login/>}/>
                <Route index path={ROUTE_DASHBOARD} element={<Dashboard/>}/>
                <Route path={ROUTE_BUILDER} element={<Builder/>}/>
                <Route path={ROUTE_SETTINGS} element={<Settings/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </div>

    );
}

export default App;
