import './App.scss';

import {Routes, Route} from 'react-router-dom';

import {ROUTE_LOGIN, ROUTE_DASHBOARD, ROUTE_BUILDER, ROUTE_SETTINGS} from "./constants/routes";

import Navbar from "./components/Navbar/Navbar";

import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Builder from "./components/Builder/Builder";
import Settings from "./components/Settings/Settings";
import NotFound from "./components/NotFound/NotFound";

function App() {
    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path={ROUTE_LOGIN} element={<Login/>}/>
                <Route index path={ROUTE_DASHBOARD} element={<Dashboard/>}/>
                <Route path={ROUTE_BUILDER} element={<Builder/>}/>
                <Route path={ROUTE_SETTINGS} element={<Settings/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </div>

    );
}

export default App;
