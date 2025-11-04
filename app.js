import express from "express";
import postsRoutes from "./routes/postsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
