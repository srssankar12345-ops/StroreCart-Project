require("./config/env")();
const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`StoreCart backend listening on port ${PORT} (env: ${process.env.NODE_ENV})`);
});
