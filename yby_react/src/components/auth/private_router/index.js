import React from 'react';
import {Navigate} from 'react-router-dom';
import SensorsIndexScreen from '../../../screens/sensors/index'

function PrivateRoute ({component: Component, ...rest}) {
    const user = localStorage.getItem('user')

    if(!user){
        return <Navigate to="/login"/>
    }
    else{
        return <SensorsIndexScreen/>
    }
}

export default PrivateRoute