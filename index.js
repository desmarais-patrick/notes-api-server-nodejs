"use strict";

const {ErrorController} = require("./src/controllers/errorController");
const {NotesController} = require("./src/controllers/notesController");
const {Router} = require("./src/router");
const {Server} = require("./src/server");

const port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || "development";

const errorController = new ErrorController({environment});
const notesController = new NotesController();
const router = new Router({errorController, notesController});
const server = new Server({environment, port, router});

server.start(function (err) {
    if (err) {
        console.error("Application couldn't be initialized.")
        console.error(err.stack || err.toString());
        return;
    }

    console.log(`Application is running at: http://localhost:${port}/`);
});
