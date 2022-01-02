import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@singhpostitapp/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //check if user already exists

    const { email, password } = req.body;

    const exisitingUser = await User.findOne({ email });

    if (exisitingUser) {
      throw new BadRequestError("This email is already in use.");
    }

    //create the user
    const user = User.build({ email, password });
    await user.save();

    //create a jwt token and set the session
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };
    //send 201 res
    res.status(201).send(user);
  }
);

export { router as signupRouter };
