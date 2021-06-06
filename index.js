require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5000
const app = express()
const URL = process.env.URL


app.use(express.json())
app.use("/auth", authRouter)

const url = URL
const start = async () => {
    try {
        await mongoose.connect(url)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()