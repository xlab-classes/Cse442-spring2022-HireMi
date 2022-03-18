import {Navigate} from 'react-router-dom';

import {ROUTE_LOGIN, ROUTE_DASHBOARD, ROUTE_SETTINGS} from "./constants/routes";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/NotFound/NotFound";

const routes = (auth, setAuth) => [
    {
        path: ROUTE_DASHBOARD,
        element: auth?.id ? <Dashboard auth={auth} /> : <Navigate to={ROUTE_LOGIN} />,
    },
    {
        path: ROUTE_SETTINGS,
        element: auth?.id ? <Settings token={auth.access_token}/> : <Navigate to={ROUTE_LOGIN} />,
    },
    {
        path: ROUTE_LOGIN,
        element: !auth?.id ? <Login setAuth={setAuth} auth={auth} /> : <Navigate to={ROUTE_DASHBOARD} />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]

export default routes;
