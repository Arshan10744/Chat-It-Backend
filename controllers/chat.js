import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utilities/features.js";
import { User } from "../models/user.js";
import {ALERT, REFETCH_CHATS} from "../constants/events.js"

const createGroupChat = TryCatch( async (req, res, next) => {

    const { name, members} = req.body;
    
    if(members.length < 2){
        res.status(400).json({ message: 'Group Chat must have 3 members'});
    }
    const allmembers = [...members, req.user];

    await Chat.create({
        name,
        isGroup: true,
        creator: req.user,
        members: allmembers
    })

    emitEvent(req, ALERT, allmembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(201).json({
        success: true,
        message: "Group Created"
    })
  });

  const myChats = TryCatch( async (req, res, next) => {

    const chats = await Chat.find({members: req.user})
    .populate("members","name avatar", User)

    return res.status(201).json({
        success: true,
        chats
    })

})


export { createGroupChat, myChats };
