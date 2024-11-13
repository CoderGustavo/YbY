const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require("dotenv").config();

// Verifica se a URL de conexão é para o MongoDB Atlas ou localhost
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/yby";

// Configurações de conexão
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Conecta ao MongoDB (local ou Atlas)
mongoose
    .connect(mongoUrl, options)
    .then(() => console.log("Connection established"))
    .catch((err) => console.log("Connection error:", err));
