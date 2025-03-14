import { generateToken } from "../lib/jwt.js"
import User from "../models/user.modal.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body
  try {
    if (!email || !fullName || !password) {
      res.status(400).json({ message: "All fields are required!!!" })
    }

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
    const hashedPassword = await bcrypt.hash(password, salt)

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
      res.status(200).json({
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

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      res.status(400).json({
        message: "All fields are required!!!",
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      res.statsu(400).json({
        message: "Invalid credentioal",
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid Credential" })
    }

    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log(`Error in login ${error}`)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
//
export const logout = (req, res) => {
  // CLEARING COOKIE TO LOGOUT USER
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "User logedout" })
  } catch (error) {
    res.status(400).json({ message: "Internal server error" })
  }
}

export const updateProfile = (req, res) => {
  const { profilePic } = req.body
  const userId = req.user._id

  try {
  } catch (error) {}
}


