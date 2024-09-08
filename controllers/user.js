import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { comparePassword, cookieOptions, hashPassword, sendToken } from "../utilities/features.js";

const createUser = TryCatch( async (req, res, next) => {
  const {name, username, password} = req.body;
  const hashedPassword = await hashPassword(password);
  const avatar = {publicid: "947384",
                  url: 'http://example.com/avatar.jpg'}

  const user = new User({
    name,
    username,
    password: hashedPassword,
    avatar: avatar
  });

  await user.save();
  
  // res.send(user)

  sendToken(res, user, 201, "User Created Successfully");
  });



const login = TryCatch(async (req, res, next) => {
  const {username, password} =  req.body;

  const user = await User.findOne({username});

  if(!user){
    next(new Error('Invalid Username'))
  }
  console.log(user)

  const isMatch = await comparePassword(password, user.password);
  
  if(!isMatch) return res.status(400).json({message: "Invlaid Password"})

  sendToken(res, user, 201, "User Login Successfull");
})

const myProfile = TryCatch(async(req, res) =>{
  res.status(200).json({
    success: true,
    data: req.user
  })
})

const logout = TryCatch(async(req, res) =>{
  return res.status(200).cookie("access-token", "", { ...cookieOptions, maxAge: 0 }).json({
    success: true,
    message: "Logged out Successfully"
  })
})

export { createUser, login, myProfile, logout };
