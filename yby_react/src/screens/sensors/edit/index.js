import React, {Fragment, useState} from "react";
import HeaderLogged from "../../../components/header_logged"
import EditSensor from "../../../components/sensors/edit"

const SensorEdit = () => {
    const [isOpen, setIsOpen] = useState(false)
    return(
        <Fragment>
            <HeaderLogged setIsOpen={setIsOpen}></HeaderLogged>
            <EditSensor setIsOpen={setIsOpen} isOpen={isOpen}></EditSensor>
        </Fragment>
    )
}

export default SensorEdit