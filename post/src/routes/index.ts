import express, { Request, Response } from "express";
import { requireAuth } from "@singhpostitapp/common";

import { Post } from "../models/post";
import { Comment } from "../models/comment";

const router = express.Router();

router.get("/api/posts", requireAuth, async (req: Request, res: Response) => {
  const posts = await Post.find({ userId: req.currentUser!.id }).populate(
    "comments"
  );

  return res.status(200).send(posts);
});

export { router as indexPostRouter };
