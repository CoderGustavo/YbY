import React, {useState, Fragment, useEffect} from "react";
import "../../../styles/sensors.scss"
import {push as Menu} from 'react-burger-menu'
import { Column, Button, Field, Control, Input, Label, Help, Title, Card } from "rbx";
import List from "../../sensors/list"
import SensorsService from "../../../services/sensors"
import { Navigate } from "react-router-dom";

const SensorEdit = (props) => {
    const [sensors, setSensors] = useState([])
    const [current_sensor, setCurrentSensor] = useState({name: "", locX: "", locY: "", id: "", depth: ""})
    const [redirectToSensors, setRedirectToSensors] = useState(false);
    const [name, setName] = useState("");
    const [locX, setLocX] = useState("");
    const [locY, setLocY] = useState("");
    const [depth, setDepth] = useState("");
    const [error, setError] = useState(false);

    async function fetchSensors() {
        const response = await SensorsService.index()
        if(response.data.length >= 1){
            setSensors(response.data.reverse())
            let sensor = localStorage.getItem('sensor')
            sensor = JSON.parse(sensor)
            setCurrentSensor(sensor)
        } else {
            setSensors([])
        }
    }

    const deleteSensor = async (sensor) => {
        let confirmacao = window.confirm("Deseja realmente excluir o sensor? \n\nEssa operação é irreversível e implica em remover todos os dados de umidade registrados.")
        
        if(confirmacao){
            await SensorsService.delete(sensor._id)
            fetchSensors()
        }
    }

    const selectSensor = (id) => {
        const sensor = sensors.find((sensor) => {
            return sensor._id === id
        })

        setCurrentSensor(sensor)
    }

    useEffect(() => {
        const fetchSensorData = async () => {
          await fetchSensors();
        };
    
        fetchSensorData();
    }, []);
    
    useEffect(() => {
        setName(current_sensor.name);
        setLocX(current_sensor.locX);
        setLocY(current_sensor.locY);
        setDepth(current_sensor.depth);
    }, [current_sensor]);

    const updateSensor = async (oldSensor, params) => {
        const updateSensor = await SensorsService.update(oldSensor._id, params)
        const index = sensors.indexOf(oldSensor)
        const newSensors = sensors
        newSensors[index] = updateSensor.data
        setSensors(newSensors)
        setCurrentSensor(updateSensor.data)
    }

    const HandleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            updateSensor(current_sensor,{'name': name, 'locX': locX, 'locY': locY, 'depth': depth})
            setRedirectToSensors(true)
        } catch (error) {
            setError(true)
        }
    }

    const HandleCancel = () => {
        setRedirectToSensors(true)
    }

    if(redirectToSensors)
    return <Navigate to="/sensors"/> 

    return(
        <Fragment>
            <Column.Group className="sensors" id="sensors">
                <Menu pageWrapId={"sensors-edit"} isOpen={props.isOpen} onStateChange={(state) => props.setIsOpen(state.isOpen)} disableAutoFocus outerContainerId={"sensors"} customBurgerIcon={false} customCrossIcon={false}> 
                    <List sensors={sensors} selectSensor={selectSensor} current_sensor={current_sensor} deleteSensor={deleteSensor}/>
                </Menu>

                <Column size={10} className="sensors-edit" id="sensors-edit">
                <Title size={5} className="has-text-custom-yellow has-text-left">
                Editar Sensor
                </Title>
                <Card>
                <Card.Content>
                <form onSubmit={HandleSubmit}>
                    <Column size={12}>
                        <Field>
                            <Label className="has-text-custom-green">Nome do Sensor</Label>
                            <Control>
                                <Input type="text" required name="name" value={name} onChange={e => setName(e.target.value)}/>
                            </Control>
                        </Field>

                        <Field>
                            <Label className="has-text-custom-green">Latitude</Label>
                            <Control>
                                <Input type="text" required name="locX" value={locX} onChange={e => setLocX(e.target.value)}/>
                            </Control>
                        </Field>

                        <Field>
                            <Label className="has-text-custom-green">Longitude</Label>
                            <Control>
                                <Input type="text" required name="locY" value={locY} onChange={e => setLocY(e.target.value)}/>
                            </Control>
                        </Field>

                        <Field>
                            <Label className="has-text-custom-green">Profundidade (metros)</Label>
                            <Control>
                                <Input type="text" required name="depth" value={depth} onChange={e => setDepth(e.target.value)}/>
                            </Control>
                        </Field>

                        <Field>
                            <Control>
                                <Column.Group breakpoint="mobile">
                                    <Column>
                                        <Button color="custom-green" outlined onClick={HandleCancel}>Cancelar</Button>
                                        <Button type="submit" color="custom-yellow" onClick={HandleSubmit}className="btn-edit">Salvar Alterações</Button>
                                    </Column>
                                </Column.Group>
                            </Control>
                        </Field>

                        {error && <Help color="danger">Nome do Sensor já cadastrado</Help>}

                    </Column>
                </form>
                </Card.Content>
                </Card>
                </Column>
            </Column.Group>
        </Fragment>
    )
}

export default SensorEdit