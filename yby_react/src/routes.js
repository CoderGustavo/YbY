import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomeScreen from './screens/home'
import LoginScreen from './screens/auth/login'
import RegisterScreen from './screens/auth/register'
import UsersEditScreen from './screens/users/edit'
import SensorCreate from './screens/sensors/create'
import SensorEdit from './screens/sensors/edit'

import PrivateRoute from "./components/auth/private_router";


const NewRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<HomeScreen></HomeScreen>}></Route>
            <Route exact path="/register" element={<RegisterScreen></RegisterScreen>}></Route>
            <Route exact path="/login" element={<LoginScreen></LoginScreen>}></Route>
            <Route exact path="/sensors" element={<PrivateRoute/>}/>
            <Route exact path="/users/edit" element={<UsersEditScreen/>}/>
            <Route exact path="/sensors/create" element={<SensorCreate/>}/>
            <Route exact path="/sensors/edit" element={<SensorEdit/>}/>
        </Routes>
    </BrowserRouter>
)

export default NewRoutes