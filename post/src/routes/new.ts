import { requireAuth, validateRequest } from "@singhpostitapp/common";
import express, { Request, Response } from "express";
import { Post } from "../models/post";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/posts",
  requireAuth,
  [
    body("caption")
      .not()
      .isEmpty()
      .withMessage("Please provide a caption for your post."),
    body("imgUrl").optional().not().isEmpty().isURL(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { caption, imgUrl } = req.body;

    const post = Post.build({ userId: req.currentUser!.id, caption, imgUrl });

    await post.save();

    res.status(201).send(post);
  }
);

export { router as newPostRouter };
