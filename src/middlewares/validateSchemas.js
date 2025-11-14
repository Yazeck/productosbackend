// src/middlewares/validateSchemas.js
export function validateSchema(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body); // Comprueba el objeto del request con el esquema
            next(); // Si no hay error, continúa
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: error.errors.map((e) => e.message) });
        }
    };
}
