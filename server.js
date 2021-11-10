require("./types");
const config = require("./config");

const express = require("express");
const { Server } = require("socket.io");

const app = express();

const server = app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})

const io = new Server(server);

module.exports = {
    express, app, server, io, config
}