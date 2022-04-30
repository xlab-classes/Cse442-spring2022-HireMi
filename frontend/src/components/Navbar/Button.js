import React from 'react';

import styles from './Button.module.scss';

const Button = props => {
    return (
        <button className={styles["dd-header-btn"]} onClick={props.onClick}>
                            <span className={`${styles["dd-header-btn-lip"]} ${styles['top']}`}>
                                <span className={`${styles['dd-header-btn-span']} ${styles['top']}`}/>
                            </span>
            <span className={`${styles["dd-header-btn-lip"]} ${styles['middle']}`}>
                                <span className={`${styles['dd-header-btn-span']} ${styles['middle']}`}/>
                            </span>
            <span className={`${styles["dd-header-btn-lip"]} ${styles['bottom']}`}>
                                <span className={`${styles['dd-header-btn-span']} ${styles['bottom']}`}/>
                            </span>
        </button>
    );
};

export default Button;
