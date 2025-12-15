import multer from 'multer';

import { v2 as cloudinary } from 'cloudinary';
//Configuración de multer
//multer recupera la imagen del request y la carga en memoria local
const storage = multer.memoryStorage();
const upload = multer({     //upload actua como un middleware para recibir imagenes
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024//5MB
    }
}).single('image');//Single sube una sola imagen
//image es el nombre del atributo del formulario

export const uploadToCloudinary = async (req, res, next) => {
    const allowedMimes = ['image/jpeg', 'image/jpg',
        'image/png', 'image/gif', 'image/webp'
    ];
    try {
        upload(req, res, async (err) => {
            if (err) {
                if (err.code == 'LIMIT_FILE_SIZE')
                    return res.status(400)
                        .json({ message: ['Tamaño del archivo excedido'] })
            }//Fin del if(err)
            if (!req.file)
                return res.status(400)
                    .json({ message: ['Imagen no encontrada'] })
            if (!allowedMimes.includes(req.file.mimetype))
                return res.status(400)
                    .json({ message: ['Tipo de archivo no permitido'] })

            //Creamos una url de cloudinary para la imagen del producto
            const image = req.file;
            //Convertir el objeto de la imagen a un objeto base64
            //para poderlo almacenar como imagen de cloudinary
            const base64Image = Buffer.from(image.buffer).toString('base64');
            const dataUri = 'data:' + image.mimetype + ';base64,' + base64Image;

            //Subimos la imagen a Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(dataUri);
            req.urlImage = uploadResponse.url;
            next();
        })//Fin de upload
    } catch (error) {
        return res.status(400)
            .json({ message: [error.message] })
    }//Fin de catch
}//Fin del uploadToCloudinary