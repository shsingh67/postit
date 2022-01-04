import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Post } from "../../models/post";

it("return 404 if the provided id for the post does not match any post id in db", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put("/api/posts")
    .set("Cookie", global.signin())
    .send({
      id,
      userId,
      caption: "adfadsf",
      imgUrl: "https://myimgsrc.com",
      likes: 20,
    })
    .expect(404);
});

it("returns a 401 if the user does not own the post", async () => {
  const response = await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "my caption for my post!" })
    .expect(201);

  await request(app)
    .put(`/api/posts`)
    .set("Cookie", global.signin())
    .send({
      id: response.body.id,
      userId: response.body.userId,
      caption: "updated caption",
      imgUrl: "https://myimgsrc.com",
      likes: 20,
    })
    .expect(401);
});

it("returns 201 on a succesfully making updates to a post", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/posts")
    .set("Cookie", cookie)
    .send({ caption: "my caption for my post!" })
    .expect(201);

  await request(app)
    .put(`/api/posts`)
    .set("Cookie", cookie)
    .send({
      id: response.body.id,
      userId: response.body.userId,
      caption: "updated caption",
      imgUrl: "https://myimgsrc.com",
      likes: 20,
    })
    .expect(200);

  await request(app)
    .put(`/api/posts`)
    .set("Cookie", cookie)
    .send({
      id: response.body.id,
      userId: response.body.userId,
      caption: "updated caption",
      imgUrl: "https://myimgsrc.com",
      likes: 20,
    })
    .expect(200);

  await request(app)
    .put(`/api/posts`)
    .set("Cookie", cookie)
    .send({
      id: response.body.id,
      userId: response.body.userId,
      caption: "updated caption",
    })
    .expect(200);
});
