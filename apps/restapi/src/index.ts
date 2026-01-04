import http from "http";
import app from "./app";

const server = http.createServer(app);
const port = 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
