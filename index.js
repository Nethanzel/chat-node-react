require("dotenv").config();

const { log } = require("console");

const path = require("path");

const express = require("express");
const formidable = require("express-formidable");
const history = require("connect-history-api-fallback");

const API_routes = require("./src/routes/index");

const app = express();

if(process.env.MODE == "development") {
    const  cors = require("cors");
    app.use(cors({ origin: "*", exposedHeaders: "*" }));
    log("DEV MODE");
}

app.set("PORT", process.env.PORT || 80);
app.use(formidable());

app.use("/api", API_routes);

app.use(history());
app.use("/", express.static(path.join(__dirname, "/chat-react/build")));

const server = app.listen(app.get("PORT"), () => { log(`The chat server is listening on port ${app.get("PORT")}`) });
const io = require("socket.io")(server, process.env.MODE == "development" ? {cors: { origin: "*", methods: "*" }} : undefined);

const socketInstance = io;

module.exports.socketInstance = socketInstance;

require("./src/socket/index");