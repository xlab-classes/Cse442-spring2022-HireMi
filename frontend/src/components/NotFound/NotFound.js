import React from 'react'

import styles from './NotFound.module.scss';

const NotFound = props => {

    return (
        <div className={styles['page-root']}>
            <div style={{color: "red", fontSize: "10rem"}}>NotFound</div>
        </div>

    )
}

export default NotFound;
