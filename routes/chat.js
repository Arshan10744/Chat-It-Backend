import express from "express";
import { createGroupChat, myChats } from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/group",isAuthenticated, createGroupChat);
app.get("/mychats",isAuthenticated, myChats)

export default app;