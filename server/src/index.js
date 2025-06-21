import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";
import { _env } from "./constant.js";

const port = _env.PORT;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => console.error(err));
