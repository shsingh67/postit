import express, { Request, Response } from "express";
import { body } from "express-validator";

import { Comment } from "../models/comment";
import { requireAuth, validateRequest } from "@singhpostitapp/common";
import { CommentCreatedPublisher } from "../events/publishers/comment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/comments",
  requireAuth,
  [body("caption").not().isEmpty().withMessage("Please Provide a Comment.")],
  validateRequest,
  async (req: Request, res: Response) => {
    //create the comments and save it
    const { caption, postId } = req.body;
    const comment = Comment.build({
      userId: req.currentUser!.id,
      postId,
      caption,
    });
    await comment.save();

    //publish an event saying a comment was created
    new CommentCreatedPublisher(natsWrapper.client).publish({
      id: comment.id!,
      userId: comment.userId,
      postId: comment.postId,
      caption: comment.caption,
      version: comment.version,
    });

    res.status(201).send(comment);
  }
);

export { router as newCommentRouter };
