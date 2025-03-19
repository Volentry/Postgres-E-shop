import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
import productRoutes from './routes/productRoutes.js'
import { sql } from "./config/db.js"
app.use('/api/product',productRoutes)
async function  initDB(params) {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

     
        )`
        console.log("initialised successfully")
    } catch (error) {
        console.log("something went wrong"+error)
    }
}

initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running on : ${PORT}`)
    })
})


