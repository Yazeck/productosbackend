import app from './app.js'
import { connectDB } from './db.js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { initializeSetup } from './libs/initialSetup.js';


//Configuramos la lectura de variables de entorno
//para conexion con cloudinary
dotenv.config();

connectDB();

await initializeSetup();

//Configuramos de cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(3000);
console.log("Servidor corriendo en el puerto 3000");