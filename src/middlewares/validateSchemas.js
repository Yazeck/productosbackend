export const validateSchema = (schema) =>(req, res, next) =>{
    try {
        schema.parse(req.body); //Comprueba el objeto request, contra el esquema
        next(); //Si no hay error, continua a la siguiente función
    } catch (error) {
        console.log(error.errors);
        return res.status(400)
                    .json({
                        message: error.issues.map ( (error)=>error.message)
                    })
    }
};//Fin de validateSchema