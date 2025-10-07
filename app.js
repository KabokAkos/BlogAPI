import express from "express";
import postRoutes from "./routes/postsRoutes.js"
import userRoutes from "./routes/usersRoutes.js"

const PORT = 3000;

const app = express();
app.use(express.json())

app.use("/posts", postRoutes)
app.use("/users", userRoutes)
app.listen(PORT, () =>{
    console.log(`Server runs on ${PORT}`)
})