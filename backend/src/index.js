import express, { json } from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { ConnectDB } from "./lib/db.js"

dotenv.config()
const app = express()
// allow to extract jsonm data from the body
app.use(express.json())
app.use("api/auth", authRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App runing on port  ${PORT}`)
  ConnectDB()
})
