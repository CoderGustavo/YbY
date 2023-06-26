const mongoose = require('mongoose')

let sensorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    locX: {type: String, required: true},
    locY: {type: String, required: true},
    depth: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    humidityData: [{type: mongoose.Schema.Types.ObjectId, ref: 'Humidity'}]
})

module.exports = mongoose.model('Sensor', sensorSchema)