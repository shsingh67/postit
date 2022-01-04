import request from "supertest";
import { app } from "../../app";

it("throws a 401 when the user is not authenticated", async () => {
  await request(app).post("/api/posts").expect(401);
});

it("responds with a 201 on a successfull post creation", async () => {
  await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "First Post!" })
    .expect(201);

  await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "First Post!", imgUrl: "https://myimgsrc.com" })
    .expect(201);
});

it("returns 400 if an invalid caption is provided", async () => {
  await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "" })
    .expect(400);
});

it("returns 400 if an invalid img src is provided", async () => {
  await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "", imgUrl: "" })
    .expect(400);

  await request(app)
    .post("/api/posts")
    .set("Cookie", global.signin())
    .send({ caption: "", imgUrl: "adfadfa" })
    .expect(400);
});
