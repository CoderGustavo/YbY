import React, {Fragment, useState} from "react";
import { Button, Column, Tag, Title, List } from "rbx";
import Moment from "moment";
import "../../../styles/sensors.scss"
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ListSensors (props) {
    const [redirectToCreateSensor, setRedirectToCreateSensor] = useState(false);
    if(redirectToCreateSensor)
    return <Navigate to="/sensors/create"/>

    return(
        <Fragment>
            <Column.Group breakpoint="mobile">
                <Column size={6}>
                    <Title size={5}>
                        {props.sensors.length} Sensor(es)
                    </Title>

                    <Button state="active" color="custom-green" size="small" onClick={() => setRedirectToCreateSensor(true)}>
                        Cadastrar Sensor
                    </Button>
                </Column>
            </Column.Group>

            <List className="sensors-list">
                {props.sensors.map((item, key) =>
                    <div key={key} onClick={() => props.selectSensor(item._id)} className={item == props.current_sensor ? 'ativado' : 'item-desativado'}>
                        <Title size={6}>
                            {item.name.replace(/(<([^>]+)>)/ig, "").substring(0,40)}
                        </Title>
                        <Title size={6} subtitle spaced={false}>
                            Latitude: {item.locX.replace(/(<([^>]+)>)/ig, "").substring(0,15)}
                            <br/>
                            Longitude: {item.locY.replace(/(<([^>]+)>)/ig, "").substring(0,15)}
                        </Title>

                        <Column.Group breakpoint="mobile">
                            <Column size={10}>
                                <Tag color="dark">
                                    {Moment(item.created_at).format('DD/MM/YYYY')}
                                </Tag>
                            </Column>
                            <Column size={2}>
                                <FontAwesomeIcon icon={faTrash} onClick={() => props.deleteSensor(item)} color="custom-green"/>
                            </Column>
                        </Column.Group>
                    </div>
                )}
            </List>
        </Fragment>
    )
}

export default ListSensors