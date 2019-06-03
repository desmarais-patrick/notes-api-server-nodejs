"use strict";

// Node module dependencies.
const http = require("http");
const url = require("url");

// Application module dependencies.
const {ContextualError} = require("./src/utilities/contextualError");

const {Datastore} = require("@google-cloud/datastore");
const {DatastoreDatabaseDriver} = require("./src/datastoreDatabaseDriver");

const {ErrorController} = require("./src/controllers/errorController");
const {NotesController} = require("./src/controllers/notesController");

const {Router} = require("./src/router");
const {Server} = require("./src/server");

// Variables.
const port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || "development";

// Initialization.
const databaseDriver = new DatastoreDatabaseDriver({
    DatastoreClass: Datastore,
    ContextualErrorClass: ContextualError
});

const errorController = new ErrorController({environment});
const notesController = new NotesController({ContextualError,databaseDriver});
const router = new Router({
    urlModule: url,
    errorController,
    notesController
});

// Server is ready to start.
const server = new Server({
    httpModule: http,
    port,
    router
});
server.addErrorHandler(function (err) {
    console.error("Application couldn't be initialized.")
    console.error(err.stack || err.toString());
});
server.start(function () {
    console.log(`Application is running at: http://localhost:${port}/`);
});
