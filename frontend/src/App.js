import styles from './App.module.scss';
import Cookies from "js-cookie";

import React, {useState, useEffect} from "react";
import {useRoutes} from 'react-router-dom';

import Navbar from "./components/Navbar/Navbar";
import routes from "./routes";

function App() {
    const [auth, setAuth] = useState({});

    const routing = useRoutes(routes(auth));

    useEffect(() => {
        setAuth({
            username: (Cookies.get("username") === undefined) ? "Anonymous" : Cookies.get("username"),
            // id: (Cookies.get("id") === undefined) ? "-1" : Cookies.get("id"),
            id: (Cookies.get("id") === undefined) ? false : Cookies.get("id"),
            pic: (Cookies.get("pic") === undefined) ? "https://lh3.googleusercontent.com/a/AATXAJxOjQQoJshWIHJ0t67X0-fqBJzgTDMnMcCaHvqy=s96-c" : Cookies.get("pic"),
            email: (Cookies.get("email") === undefined) ? "hiremi.ub@gmail.com" : Cookies.get("email"),
        })

    }, []);

    return (
        <div className={styles['app-root']}>
            <Navbar auth={auth} />
            {routing}
        </div>

    );
}

export default App;
