import express from "express";
import {
  addMembers,
  createGroupChat,
  getMyGroups,
  myChats,
  removeMembers,
} from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/group", createGroupChat);

app.get("/myChats", myChats);

app.get("/myGroupChats", getMyGroups);

app.put("/addMembers", addMembers);

app.put("/removeMember", removeMembers);

export default app;
