import mongoose from "mongoose";


export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log('DB Connected successfully');
        }) 
        connection.on('error',()=>{
            console.log('Error connecting to DB');
            process.exit();
        })
    } catch (error) {
        console.log('Something Went Wrong : DB');
        
    }
}