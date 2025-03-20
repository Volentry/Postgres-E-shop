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
import arcjet from "arcjet"
import { aj } from "./lib/arcjet.js"
app.use(async (req,res,next)=>{
   try {
    const decision = await aj.protect(req,{
        requested:1
    })

    if(decision.isDenied()){
        if(decision.reason.isRateLimit){
            res.status(429).json({
                error:"too many requests"
            })
        }
        if(decision.reason.isBot){
            res.status(403).json({
                error:"Bot access denied"
            })
            
        }else{
            res.status(403).json({
                error:"Forbidden"
            })   
            
        }
        return 
        
    }
    if(decision.results.some((result)=>result.reason.isBot()&&result.reason.isSpoofed())){
        res.status(403).json({
            error:"Spoofed bot detected"
        }) 
    }
    next()
   } catch (error) {

    res.status(500).json({
        message:"Something went wrong"
    })
    next(error)
    
   }
})
app.use('/api/products',productRoutes)
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


