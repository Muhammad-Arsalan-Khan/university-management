import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectMongoDB } from "./connection/db.js"
import Routes from "./Routes/Routers.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { customLogger } from "./middleware/logMiddleware.js"
dotenv.config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())

//log middleware
app.use(customLogger)


//Route
app.use("/api",Routes)
// app.use("/",(req, res) => res.json({msg: "server start"}))


//error middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
connectMongoDB()
  .then(() => {
      console.log("database connected")
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error(" MongoDB connection failed", err.message)
    process.exit(1)
  })

