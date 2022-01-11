import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { Comment } from "../../models/comment";

it("returns all posts made by a user", async () => {
  const cookie = global.signin();

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie)
    .send({
      caption: "Making a post!",
    })
    .expect(201);

  const response = await request(app)
    .get("/api/posts")
    .set("Cookie", cookie)
    .expect(200);
});
