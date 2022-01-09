import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@singhpostitapp/common";
import mongoose from "mongoose";
import express, { Request, Response } from "express";

import { Post } from "../models/post";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/posts",
  requireAuth,
  [
    body("id")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TickedId must be provided"),
    body("userId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("userId must be provided"),
    body("caption")
      .not()
      .isEmpty()
      .withMessage("Please provide a caption for your post."),
    body("imgUrl").optional().not().isEmpty().isURL(),
    body("likes")
      .optional()
      .isInt({ min: 0 })
      .withMessage(
        "Number of likes must be a numberic value greater than zero."
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const post = await Post.findById(req.body.id);

    if (!post) {
      throw new NotFoundError();
    }

    if (post.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    post.set({
      caption: req.body.caption,
      imgUrl: req.body.imgUrl,
      likes: req.body.likes,
    });
    res.status(200).send(post);
  }
);

export { router as updatePostRouter };
