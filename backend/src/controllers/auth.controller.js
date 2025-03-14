import { generateToken } from "../lib/jwt.js"
import User from "../models/user.modal.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body
  try {
    if (password.legth < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: "User already exist" })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hash((password, salt))

    //Before saving we need to hash
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    })
    // WHEN THE NEW USER IS CREATED WE NEED TO ASSIGN OR CREATE A JWT TOKEN FOR HIM/HER.
    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()
      re.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })
    } else {
      res.status(400).json({ message: "Inavalid user details" })
    }
  } catch (error) {
    console.log(`Error in signup controller!!!, ${error}`)
  }
}

export const login = (req, res) => {
  
}

export const logout = (req, res) => {
  res.json({ message: "loggged out" })
}
