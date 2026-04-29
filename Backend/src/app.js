const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', 1)

app.use(express.static("./public")) // for deployment

app.use(cors({
    origin:[ "http://localhost:5173",
    "https://moodify-app-n3r2.onrender.com"
    ],
    credentials: true
}))

const authRoutes = require("./routes/auth.routes")
const songRoutes = require("./routes/song.routes")


app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)

module.exports = app