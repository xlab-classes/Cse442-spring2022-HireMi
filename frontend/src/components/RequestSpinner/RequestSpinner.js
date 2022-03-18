import React from "react";
import styles from './RequestSpinner.module.scss';

const RequestSpinner = () => {

    return(
        <div className={styles['-request-spinner']}>
            <div className={styles['loader']}>...Loading</div>
        </div>
    )
}

export default RequestSpinner;
