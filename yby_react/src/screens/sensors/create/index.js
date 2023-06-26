import React, {Fragment, useState} from "react";
import HeaderLogged from "../../../components/header_logged"
import NewSensor from "../../../components/sensors/create"

const SensorCreate = () => {
    const [isOpen, setIsOpen] = useState(false)
    return(
        <Fragment>
            <HeaderLogged setIsOpen={setIsOpen}></HeaderLogged>
            <NewSensor setIsOpen={setIsOpen} isOpen={isOpen}></NewSensor>
        </Fragment>
    )
}

export default SensorCreate