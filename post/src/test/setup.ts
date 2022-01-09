import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { Comment } from "../models/comment";

declare global {
  function signin(): string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "adfadf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //create payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //Build JTW Token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Create session object {jwt: my_jwt}
  const session = { jwt: token };

  //turn session object into json
  const sessionJSON = JSON.stringify(session);

  //Encode it to base67
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
