import React from 'react';
import {Navigate} from "react-router-dom";

// https://github.com/remix-run/react-router/issues/8610
// Using navigate to

export const ProtectedRoute = ({OgRoute, auth}) => {
    return class extends React.Component {
        render() {
            if(!auth) {
                return <Navigate to={'/login'} />
            }
            return <OgRoute {...this.props} />
        }
    }
}

export const LoginRoute = ({OgRoute, auth}) => {
    return class extends React.Component {
        render() {
            if(!auth) {
                return <Navigate to={'/'} />
            }
            return <OgRoute {...this.props} />
        }
    }
}
