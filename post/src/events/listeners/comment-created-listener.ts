import { Message } from "node-nats-streaming";

import {
  Listener,
  CommentCreatedEvent,
  Subjects,
} from "@singhpostitapp/common";
import { queueGroupName } from "./queue-group-name";
import { Post } from "../../models/post";
import { Comment, CommentDoc } from "../../models/comment";

export class CommentCreatedListener extends Listener<CommentCreatedEvent> {
  readonly subject = Subjects.CommentCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: CommentCreatedEvent["data"], msg: Message) {
    const { id, userId, postId, caption } = data;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("This post no longer exists.");
    }

    const comment = Comment.build({ id, userId, postId, caption });
    await comment.save();

    let comments: CommentDoc[];
    post.comments === undefined ? (comments = []) : (comments = post.comments);

    comments.push(comment);
    post.set({ comments });
    await post.save();

    msg.ack();
  }
}
