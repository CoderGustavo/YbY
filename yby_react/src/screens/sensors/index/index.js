import React, {Fragment, useState} from "react";
import HeaderLogged from "../../../components/header_logged"
import Sensors from "../../../components/sensors"

const SensorsIndexScreen = () => {
    const [isOpen, setIsOpen] = useState(false)
    return(
        <Fragment>
            <HeaderLogged setIsOpen={setIsOpen}></HeaderLogged>
            <Sensors setIsOpen={setIsOpen} isOpen={isOpen}></Sensors>
        </Fragment>
    )
}

export default SensorsIndexScreen