const mongoose = require('mongoose');
require('dotenv').config()


const mongoURI = process.env.DB_CONNECTION; 
const db = mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Database connected")
}).catch((err) => {
    console.log(`Error ${err.message}`)
});

module.exports = {
    db
}