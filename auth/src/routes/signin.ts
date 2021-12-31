import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must enter a password"),
  ],
  async (req: Request, res: Response) => {
    //check if user exists and compare password
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (
      !existingUser ||
      !(await Password.compare(existingUser.password, password))
    ) {
      throw new Error("Something ");
    }

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser?.id,
        email: existingUser.email,
      },

      process.env.JWT_KEY!
    );

    //Store in session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  }
);
