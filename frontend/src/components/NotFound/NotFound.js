import React from 'react'
import {ROUTE_DASHBOARD} from "../../constants/routes";
import styles from './NotFound.module.scss';
import {NavLink} from "react-router-dom";
const NotFound = props => {

    return (
        <div className={styles['page-root']}>
            <h1>OOPS!</h1>
            <h2>We can't seem to find the page you are looking for</h2>
            <p>error code: 404</p>
            <NavLink to={ROUTE_DASHBOARD}>Back to dashboard</NavLink>
        </div>

    )
}

export default NotFound;
