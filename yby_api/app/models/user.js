const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    whats: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    uf: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    //sensors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Sensor'}]
})

userSchema.pre('save', function (next){
    if (this.isNew || this.isModified('password')){
        bcrypt.hash(this.password, 10, (err, hashedPassword) => {
            if (err){
                next(err)
            }
            else {
                this.password = hashedPassword
                next()
            }
        })
    }
})

userSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function(err, same){
        if (err) {
            callback(err)
        }
        else{
            callback(err, same)
        }
    })
}

module.exports = mongoose.model('User', userSchema)