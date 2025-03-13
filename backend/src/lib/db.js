import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const ConnectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Mongo Db Conneted Succesfully: ${connect.connection.host}`)
  } catch (error) {
    console.log(`Mongo Connection Failed,${error}`)
  }
}
