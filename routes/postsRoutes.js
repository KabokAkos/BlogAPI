import { Router } from "express";
import * as Posts from "../data/post.js";

const router = Router();

router.get("/", (req, res) => {
  const posts = Posts.getPosts();
  res.json(posts);
});

export default router;
