const app = require("./index");
const http = require("http");
const config = require("config");
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(config.get("App"), process.env.PORT);
});
