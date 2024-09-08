import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
}

const connectDB = (uri) => {
    mongoose.connect(uri, { dbName: "ChatApp"})
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) =>{
        throw err;
    })
}

const hashPassword = async (password) =>{
    
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
    }}

const comparePassword =  async (password, hashedPassword) =>{
    console.log(password, hashedPassword)
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch;
} 

const sendToken = (res, user, code, message) =>{
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

  return res.status(code).cookie("access-token", token, cookieOptions)
  .json({
    sucess: true,
    message,
  })
}

const emitEvent = (req, event, users, data ) =>{
  console.log("Emmiting Event", event);
}


export {connectDB, hashPassword, comparePassword, sendToken, cookieOptions, emitEvent}