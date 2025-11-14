import cloudinary from 'cloudinary';
import multer from 'multer';

//configuracion de multer
//recupera la imagen del request y la carga en memoria local
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1042 * 1024 //5MB
    }
}).single('image');//single sube una sola imagen
//image es el nombre del atributo del formulario
export const uploadCloudinary = async (req,resizeBy,next)=>{
    const allowedMimes = [

    ];
    try {
        upload(req, res, async(err) =>{
            if (err.code == 'LIMIT_FILE_SIZE')
                return res.status(400)
            .json({message: ['Tamaño de archivo extendido']})

        })
        next();
    } catch (error) {
        return res.status(400)
        .json({message: [error.message]})
    }
}
