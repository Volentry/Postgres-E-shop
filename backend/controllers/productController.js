import { sql } from "../config/db.js"

export const getAllProducts = async  (req,res)=>{
   try {
      const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
      
      `
      res.status(200).json({
        success:true,
        data:products
      })
   } catch (error) {
    res.status(500).json({
        success:false,
        message:"Something went wrong while processing all products"
    })
    
   }
}
export const createProduct = async  (req,res)=>{
    console.log(req.body)
    const {name,price,image} = req.body
    if(!name||!price||!image){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    try {
        const newProduct = await sql`
        INSERT INTO products (name,price,image)
        VALUES (${name},${price},${image})
        RETURNING *`

        res.status(201).json({
            success:true,
            data:newProduct[0]
        })


        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while creating a  product"
        })
    }

}
export const getProduct = async  (req,res)=>{
    const {id} = req.params
    try {
        const product = await sql`
        SELECT * FROM products WHERE id =${id}`
        res.status(200).json({
            status:true,
            data:product[0]
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while getting    product data"
        })
    }

}
export const updateProduct = async  (req,res)=>{
    const {id} = req.params
    const {name,price,image} = req.body 
    try {
       const updateProduct =  await sql`
        UPDATE products
        SET name = ${name},price = ${price},image = ${image}
        WHERE id=${id}
        RETURNING *`
        if(updateProduct.length===0){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            data:updateProduct[0]
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
    }

}
export const deleteProduct = async  (req,res)=>{
    const {id} = req.params
    try {
        const deletedProduct = await sql`
        DELETE FROM products WHERE id=${id} RETURNING *`
         if(deletedProduct.length===0){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            data:deletedProduct[0]
        })
         
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }

}