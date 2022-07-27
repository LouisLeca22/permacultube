import jwt from "jsonwebtoken"
import {createError} from "./errors.js"
export const verifyToken =  (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) return next(createError(401, "Vous n'êtes pas authentifié"))
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err)  return next(createError(403, "Vous n'êtes pas authentifié"))
        req.user = user;
        next()
    })
}