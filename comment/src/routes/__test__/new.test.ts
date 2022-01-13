import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

import { natsWrapper } from "../../nats-wrapper";

it("throws 404 if user is not authenticated", async () => {
  await request(app).post("/api/comments").expect(401);
});

it("throws 400 if caption is empty", async () => {
  await request(app)
    .post("/api/comments")
    .set("Cookie", global.signin())
    .send({ caption: "" })
    .expect(400);
});

it("emits an comment created event", async () => {
  await request(app)
    .post("/api/comments")
    .set("Cookie", global.signin())
    .send({
      userId: new mongoose.Types.ObjectId().toHexString(),
      postId: new mongoose.Types.ObjectId().toHexString(),
      caption: "Your post is amazing!",
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
