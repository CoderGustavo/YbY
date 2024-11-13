var express = require('express');
var router = express.Router();
const User = require('../models/user')
const Sensor = require('../models/sensor')
const Humidity = require('../models/humidity')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.JWT_TOKEN
const withAuth = require('../middlewares/auth')

router.post('/register', async (req, res) => {
  const {name, email, password, whats, address, city, uf} = req.body
  const user = new User({name, email, password, whats, address, city, uf})

  try {
    await user.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error: 'Erro ao registrar novo usuário'})
  }
})

router.post('/login', async (req, res) =>{
  const {email, password} = req.body

  try {
    let user = await User.findOne({email})
    if (!user){
      res.status(401).json({error: 'E-mail incorreto.'})
    }
    else{
      user.isCorrectPassword(password, function(err, same){
        if(!same){
          res.status(401).json({error: 'Senha incorreta.'})
        }
        else{
          const token = jwt.sign({email}, secret, {expiresIn: '10d'})
          res.json({user: user, token: token})
        }
      })
    }
  } catch (error) {
    res.status(500).json({error: 'Erro interno. Tente novamente'})
  }
})

router.put('/', withAuth, async function (req, res){
  const {name, email, password, whats, address, city, uf} = req.body

  try {
    var user = await User.findByIdAndUpdate({_id: req.user._id}, {$set: {name: name, email: email, password: password, whats: whats, address: address, city: city, uf: uf}}, {upsert: true, 'new': true})
    res.json(user)
  } catch (error) {
    res.status(401).json({error: error})
  }
})

router.put('/password', withAuth, async function(req, res){
  const { password } = req.body;

  try {
    var user = await User.findById({_id: req.user._id})
    user.password = password
    user.save()
    res.json(user);

  } catch (error) {
    res.status(401).json({error: error});
  }

})

router.delete('/', withAuth, async function(req, res){
  try {
    let user = await User.findById({_id: req.user._id})
    let sensors = await Sensor.find({user: user._id})
    sensors.forEach(async sensor => {
      await Humidity.deleteMany({sensor: sensor.id})
    })
    await Sensor.deleteMany({user: user._id})
    await User.deleteOne({_id: user._id})
    res.json({message: "Usuário excluído com sucesso"}).status(201)
  } catch (error) {
    res.status(500).json({error: error})
  }
})

module.exports = router;
