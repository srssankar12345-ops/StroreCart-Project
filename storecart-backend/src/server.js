import dotenv from "dotenv";


if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import app from "./app.js"
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`StoreCart backend listening on port ${PORT} (env: ${process.env.NODE_ENV})`);
});
