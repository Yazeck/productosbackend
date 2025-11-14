import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    console.log('⏳ Intentando conectar a la base de datos...');
    console.log('🔹 URI:', process.env.MONGO_URI); // Verificamos que la variable exista

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Base de datos conectada correctamente');
        console.log('🔹 Nombre:', db.connection.name);
        console.log('🔹 Host:', db.connection.host);
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:');
        console.error(error.message);
    }
};
