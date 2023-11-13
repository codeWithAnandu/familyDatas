const express = require('express')
const app = express()
require('dotenv').config()
const familyRoutes = require("./Routes/family")
const mongoose = require("mongoose")

app.use('/api/families', familyRoutes)

//ensuring db connection before server boot
mongoose.connect(process.env.DB_CONNECTION).then(() => {
    console.log('Mongo Connected')
    app.listen(process.env.PORT, () => {
        console.log("listening to port ", process.env.PORT)
    })
}).catch((err) => {
    console.log(err)
})