import React, {useState, Fragment, useEffect} from "react";
import "../../styles/sensors.scss"
import {push as Menu} from 'react-burger-menu'
import { Column, Button, Content } from "rbx";
import List from "../sensors/list"
import SensorsService from "../../services/sensors"
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import pinMarcado from "../../assets/images/pinMarcado.png"
import { Navigate } from "react-router-dom";
import pin from "../../assets/images/pin.png"

function createChart (current_sensor) {    
    let data = []
    for (let i = 0; i < current_sensor.humidityData.length; i++){
        if(current_sensor.humidityData[i] == undefined){
            break
        }
        else{
            let elemento = current_sensor.humidityData[i].humidityValue
            data.push(elemento)
        }   
    }
    data.reverse()
    var threshold = 50;
  
    // Configurações do gráfico
    var width = 400;
    var height = 200;
    var barPadding = 5;
  
    // Criar o elemento SVG
    var svg = document.getElementById("chart");
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
  
    // Escala para o eixo y
    var maxValue = Math.max(...data);
    var yScale = height / maxValue;
  
    // Criar as barras
    for (var i = 0; i < 10; i++) {
      var bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bar.setAttribute("class", "bar" + (data[i] >= threshold ? " red" : ""));
      bar.setAttribute("x", i * (width / 10));
      bar.setAttribute("y", height - (data[i] * yScale));
      bar.setAttribute("width", width / 10 - barPadding);
      bar.setAttribute("height", data[i] * yScale);
      svg.appendChild(bar);
  
      // Adicionar legenda
      var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", i * (width / 10) + ((width / 10 - barPadding) / 2));
      text.setAttribute("y", height - 5); // Ajuste da posição da legenda para abaixo da barra
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("alignment-baseline", "baseline"); // Alinhamento da legenda à linha de base
      text.textContent = data[i];
      svg.appendChild(text);
    }
};

const Sensors = (props) => {
    const [sensors, setSensors] = useState([])
    const [current_sensor, setCurrentSensor] = useState({name: "", locX: "", locY: "", id: "", depth: "", humidityData: [""]})
    const [redirectToEdit, setRedirectToEdit] = useState(false);

    async function fetchSensors() {
        const response = await SensorsService.index()
        if(response.data.length >= 1){
            setSensors(response.data.reverse())
            setCurrentSensor(response.data[0])
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
        fetchSensors()
    },[])

    useEffect(() => {
        createChart(current_sensor)
    },[current_sensor])

    const customPinMarcado = new Icon({
        iconUrl: pinMarcado,
        iconSize: [30, 30]
    })

    const customPin = new Icon({
        iconUrl: pin,
        iconSize: [30, 30]
    })
    
    if(redirectToEdit){
        localStorage.setItem('sensor', JSON.stringify(current_sensor))
        return <Navigate to="/sensors/edit"/> 
    }

    return(
        <Fragment>
            <Column.Group className="sensors" id="sensors">
                <Menu pageWrapId={"sensors-map"} isOpen={props.isOpen} onStateChange={(state) => props.setIsOpen(state.isOpen)} disableAutoFocus outerContainerId={"sensors"} customBurgerIcon={false} customCrossIcon={false}> 
                    <List sensors={sensors} selectSensor={selectSensor} current_sensor={current_sensor} deleteSensor={deleteSensor}/>
                </Menu>

                <Column size={12} className="sensors-map" id="sensors-map">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css" />
                    <MapContainer center={[-22.45650, -46.81101]} zoom={10} style={{ height: "50vh", width: "100%" }} id='map'>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    
                        {sensors.map(sensor => (
                            <Marker key={sensor._id} position={[sensor.locX, sensor.locY]} icon={current_sensor.name === sensor.name ? customPinMarcado : customPin}>
                            </Marker>
                        ))}
                    </MapContainer>

                    <Content size={6} className="info-sensors">
                        <div className="info-txt">
                            <h4><strong id="nome-sensor">Nome do Sensor:</strong> {current_sensor.name}</h4>
                            <p><strong>Latitude:</strong> {current_sensor.locX}</p>
                            <p><strong>Longitude:</strong> {current_sensor.locY}</p>
                            <p><strong>Profundidade:</strong> {current_sensor.depth} m</p>
                            <Button color="custom-yellow" current_sensor={current_sensor} size="small" onClick={() => setRedirectToEdit(true)}>Editar Sensor</Button>
                        </div>
                        <div className="grafico">
                        <svg id="chart"></svg>
                        </div>
                    </Content>
                </Column>
            </Column.Group>
        </Fragment>
    )
}

export default Sensors