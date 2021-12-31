import { app } from "./app";

const start = async () => {
  try {
    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    });
  } catch (err) {}
};

start();
