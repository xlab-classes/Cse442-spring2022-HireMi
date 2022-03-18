import React from 'react';


const Backdrop = props => (
    <div className="backdrop" onClick={props.click} style={{
        cursor: 'pointer',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        background: 'rgba(0,0,0,0.3)',
        /* togglebutton z-index 100 */
        zIndex: 99,
        transition: '.0s'
    }}/>
);

export default Backdrop;
