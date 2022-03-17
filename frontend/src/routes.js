import {Navigate} from 'react-router-dom';

import {ROUTE_LOGIN, ROUTE_DASHBOARD, ROUTE_SETTINGS} from "./constants/routes";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/NotFound/NotFound";

const routes = isAuth => [
    {
        path: ROUTE_DASHBOARD,
        element: isAuth.id ? <Dashboard /> : <Navigate to={ROUTE_LOGIN} />,
    },
    {
        path: ROUTE_SETTINGS,
        element: isAuth.id ? <Settings /> : <Navigate to={ROUTE_LOGIN} />,
    },
    {
        path: ROUTE_LOGIN,
        element: !isAuth.id ? <Login /> : <Navigate to={ROUTE_DASHBOARD} />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]

export default routes;
