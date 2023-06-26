const mongoose = require('mongoose')

let humiditySchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    humidityValue: {type: String, required: true},
    sensor: {type: mongoose.Schema.Types.ObjectId, ref: 'Sensor'}
})

module.exports = mongoose.model('Humidity', humiditySchema)