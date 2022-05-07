import React from 'react';

import './HeaderButton.scss';

const HeaderButton = props => {
    return (
        <button className={"dd-header-btn"} onClick={props.onClick}>
                            <span className={"dd-header-btn-lip top"}>
                                <span className={"dd-header-btn-span top"}/>
                            </span>
            <span className={"dd-header-btn-lip middle"}>
                                <span className={"dd-header-btn-span middle"}/>
                            </span>
            <span className={"dd-header-btn-lip bottom"}>
                                <span className={"dd-header-btn-span bottom"}/>
                            </span>
        </button>
    );
};

export default HeaderButton;
