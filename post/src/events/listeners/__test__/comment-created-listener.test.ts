import mongoose from "mongoose";
import request from "supertest";
import { Message } from "node-nats-streaming";

import { app } from "../../../app";
import { CommentCreatedEvent } from "@singhpostitapp/common";
import { natsWrapper } from "../../../nats-wrapper";
import { CommentCreatedListener } from "../comment-created-listener";
import { Post } from "../../../models/post";

const setup = async () => {
  const listener = new CommentCreatedListener(natsWrapper.client);

  // make a post
  const response = await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "Making a post!" });

  // create the events
  const firstComment: CommentCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    postId: response.body.id,
    caption: "your post is amazing",
    version: 0,
  };

  const secondComment: CommentCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    postId: response.body.id,
    caption: "your post is amazing",
    version: 0,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, firstComment, secondComment, msg };
};

it("listens to comment created event and saves that comment inside the specific post", async () => {
  const { listener, firstComment, msg } = await setup();

  await listener.onMessage(firstComment, msg);

  // make assesrtions to make sure the comment was added to the post
  const post = await Post.findById(firstComment.postId).populate("comments");

  expect(post!.comments).toBeDefined();
  expect(post!.comments[0].caption).toEqual(firstComment.caption);
});

it("saves two comments inside the specific post", async () => {
  const { listener, firstComment, secondComment, msg } = await setup();

  await listener.onMessage(firstComment, msg);
  await listener.onMessage(secondComment, msg);

  // make assesrtions to make sure the comment was added to the post
  const post = await Post.findById(firstComment.postId).populate("comments");

  expect(post.comments.length).toEqual(2);
});
