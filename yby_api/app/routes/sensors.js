var express = require('express');
var router = express.Router();
const Sensor = require('../models/sensor')
const Humidity = require('../models/humidity')
const withAuth = require('../middlewares/auth')

router.post('/', withAuth, async (req, res) => {
    const {name, locX, locY, depth} = req.body

    try {
        let sensor = new Sensor({name: name, locX: locX, locY: locY, depth: depth, user: req.user._id})
        await sensor.save()
        res.status(200).json(sensor)
    } catch (error) {
        res.status(500).json({error: 'Problemas ao cadastrar novo sensor'})
    }
})

router.get('/:id', withAuth, async (req, res) =>{
    try {
        const {id} = req.params
        let sensor = await Sensor.findById(id).populate('humidityData')
        if(isOwner(req.user, sensor)){
            res.json(sensor)
        }
        else{
            res.status(403).json({error: 'Acesso negado: sensor pertence a outro usuário'})
        }

    } catch (error) {
        res.status(500).json({error: 'Problema ao recuperar informações do sensor'})
    }
})

router.get('/', withAuth, async (req, res) =>{
    try {
        let sensors = await Sensor.find({user: req.user._id}).populate('humidityData')
        res.json(sensors)
    } catch (error) {getData
        res.status(500).json({error: 'Problema ao carregar sensor(es) do usuário'})
    }
})

router.put('/:id', withAuth, async (req, res) =>{
    const {name, locX, locY, depth} = req.body
    const{id} = req.params

    try {
        let sensor = await Sensor.findById(id)
        if(isOwner(req.user, sensor)){
            let sensor = await Sensor.findByIdAndUpdate(id, {$set: {name: name, locX: locX, locY: locY, depth: depth}}, {upsert: true, 'new': true})

            res.json(sensor)
        }
        else{
            res.status(403).json({error: 'Acesso negado: sensor pertence a outro usuário'})
        }
    } catch (error) {
        res.status(500).json({error: 'Problema ao carregar sensor do usuário'})
    }

})

router.delete('/:id', withAuth, async (req, res) =>{
    const{id} = req.params

    try {
        let sensor = await Sensor.findById(id)
        if(isOwner(req.user, sensor)){
            await Humidity.deleteMany({sensor: id})
            await sensor.deleteOne()
            res.json({message: 'Sensor deletado com sucesso!'}).status(204)
        }
        else{
            res.status(403).json({error: 'Acesso negado: sensor pertence a outro usuário'})
        }
    } catch (error) {
        res.status(500).json({error: 'Problema ao deletar sensor do usuário'})
    }

})

const isOwner = (user, sensor) => {
    if(JSON.stringify(user._id) == JSON.stringify(sensor.user._id)){
        return true
    }
    else{
        return false
    }
}

module.exports = router