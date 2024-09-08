import express from "express";
import { createUser, login, logout, myProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/", createUser);
app.post("/login", login);

app.use(isAuthenticated)

app.get("/me",isAuthenticated, myProfile)

app.get("/logout", logout)

export default app;