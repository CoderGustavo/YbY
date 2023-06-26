import React, {useState, Fragment} from "react";
import {push as Menu} from 'react-burger-menu'
import { Button, Field, Control, Input, Column, Label, Section, Help, Card, Title} from 'rbx';
import SensorsService from "../../../services/sensors"
import { Navigate } from "react-router-dom";
import "../../../styles/sensors.scss"

const NewSensor = (props) => {
    const [name, setName] = useState("");
   const [locX, setLocX] = useState("");
   const [locY, setLocY] = useState("");
   const [depth, setDepth] = useState("");
   const [redirectToSensors, setRedirectToSensors] = useState(false);
   const [error, setError] = useState(false);
   
   const HandleSubmit = async (evt) => {
    evt.preventDefault()
    try {
        const sensor = await SensorsService.create({name: name, locX: locX, locY: locY, depth: depth})
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
                <Menu pageWrapId={"sensors-create"} isOpen={props.isOpen} onStateChange={(state) => props.setIsOpen(state.isOpen)} disableAutoFocus outerContainerId={"sensors"} customBurgerIcon={false} customCrossIcon={false}> 
                    <Button state="active" color="custom-yellow" size="small" onClick={() => setRedirectToSensors(true)}>
                        Retornar aos Sensores
                    </Button>
                </Menu>

                <Column size={10} className="sensors-create" id="sensors-create">
                <Title size={5} className="has-text-custom-yellow has-text-left">
                Cadastrar Sensor
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
                                        <Button type="submit" color="custom-yellow" onClick={HandleSubmit} className="btn-edit">Cadastrar</Button>
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

export default NewSensor