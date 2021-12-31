import express, { Request, Response } from "express";
import { Post } from "../models/post";

const router = express.Router();

//post will have
// userId, postId, comment[], likes, timestamp,

//TODO: add req validtor
router.post("api/posts", async (req: Request, res: Response) => {
  //Build the post and save it to the database
  const post = Post.build({
    userId: req.currentUser!.id,
  });

  res.status(201).send(post);
});

export { router as newPostRouter };
