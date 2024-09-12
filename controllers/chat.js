import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { emitEvent } from "../utilities/features.js";
import { User } from "../models/user.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";

const createGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2) {
    res.status(400).json({ message: "Group Chat must have 3 members" });
  }
  const allmembers = [...members, req.user];

  await Chat.create({
    name,
    isGroup: true,
    creator: req.user,
    members: allmembers,
  });

  emitEvent(req, ALERT, allmembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Created",
  });
});

const myChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user });

  return res.status(201).json({
    success: true,
    chats: chats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const groupChats = await Chat.find({
    members: req.user,
    isGroup: true,
    creator: req.user,
  });

  return res.status(200).json({
    success: true,
    groupchats: groupChats,
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members) {
    return res.status(400).json({ message: "Members not found" });
  }

  if (members.length < 1) {
    return res.status(400).json({ message: "There must be atleast 1 member" });
  }
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: "Chat with this Id dont exist!" });
  }

  if (chat.creator !== req.user) {
    return res
      .status(403)
      .json({ message: "You are not allowed to add members" });
  }

  const allNewMembersPromise = members.map((member) => {
    User.findById(member);
  });

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const newMembersToAdd = allNewMembers.filter(
    (newMember) => !chat.members.includes(newMember._id.toString())
  );

  if (newMembersToAdd.length === 0) {
    return res.status(400).json({ message: "No new members to add." });
  }

  chat.members.push(...allNewMembers.map((i) => i._id));

  await chat.save();

  const memberNames = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${memberNames} has been added to the group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "members added successfully",
  });
});

const removeMembers = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: "Chat with this Id dont exist!" });
  }

  if (chat.creator !== req.user) {
    return res
      .status(403)
      .json({ message: "You are not allowed to Remove members" });
  }

  const updatedMembers = chat.members.filter(
    (id) => id.toString() !== userId.toString()
  );

  chat.members = updatedMembers;
  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userId} has been removed from the group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "member Removed successfully",
  });
});

export { createGroupChat, myChats, getMyGroups, addMembers, removeMembers };
