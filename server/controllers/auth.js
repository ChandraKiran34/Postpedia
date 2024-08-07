import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER 

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile:Math.floor(Math.random()* 1000),
      impressions : Math.floor(Math.random() * 1000),
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(201).json({sucess : true, message : "user registred successfully" , savedUser});
  } catch (err) {
    res.status(500).json({error:err.message})
  }
};

// LOGIN

export const login = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) { return res.status(400).json({msg:"User does not exist"})};

        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch) { return res.status(400).json({msg:"Invalid credentials"})};
        console.log(user);

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({sucess : true, message: "login success", token,user})
    } catch (error) {
      console.log(error)
        res.status(500).json({success : false, message : error.message})
    }
}