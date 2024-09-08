import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken"

const isAuthenticated = TryCatch(async (req, res, next) =>{

    const token = req.cookies["access-token"];

    if(!token)
    return res.status(401).json({message: "Unauthorized Access"})

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData._id

    next()
})

export {isAuthenticated}