import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

//Funcion para generar un token de inicio de sesión
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: '1d' //El token expira en 1 día
            }, (err, token) => {
                if (err) {
                    reject(err);
                    console.log(err);

                }

                resolve(token);
            });
    });
}