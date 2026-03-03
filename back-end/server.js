import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/db.js'
import router from './routes/routes.js'
import cors from 'cors'
const app = express()

dotenv.config()
connectDB()
const PORT = process.env.PORT || 5000

app.use("/api/uploads", express.static("uploads"));
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use('/api' , router)

app.listen(PORT , () => {
    console.log(`server is running on port no ${PORT}`)
})