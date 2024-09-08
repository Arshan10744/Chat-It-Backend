import express from 'express'
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import { connectDB } from './utilities/features.js';
import { errorMiddleware } from './middlewares/error.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 4000;
const app = express()

connectDB(mongoURI);

app.use(express.json())
app.use(cookieParser())

app.use("/user", userRoutes)
app.use("/chat", chatRoutes)

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})
