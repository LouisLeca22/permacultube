import express from "express"
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path"
import {dirname} from "path"
import { fileURLToPath } from "url"
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import authRoute from "./routes/auth.js";



dotenv.config();
const connect = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("connected to db")
  }).catch(err => {throw err} )
}
connect()

const app = express();
const port = process.env.PORT

const __dirname = dirname(fileURLToPath(import.meta.url))


app.use(cors());
app.use(cookieParser())
app.use(express.json())
app.use("/api/users", userRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/auth", authRoute)


app.use((err, req, res, next) => {
  const status = err.status || 500 
  const message = err.message || "Il y a eu une erreur"
  return res.status(status).json({
      success: false, 
      status,
      message
  })
})


app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});


app.listen(port, () => {

  console.log(`server running on port ${port}`)
})
