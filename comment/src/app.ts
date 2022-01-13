import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import { newCommentRouter } from "./routes/new";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@singhpostitapp/common";

const app = express();
//Since we are behind ingress-nginx controller
app.set("trust proxy", true);
app.use(json());
//No need to encrypt the cookie since we are using JWT's and only use cookies over a https connection
//(no need to secure cookies in test env)
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(newCommentRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
