import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting...");
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To MongoDB!");
    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
};

start();
