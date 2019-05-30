"use strict";

const url = require("url");
const {ContextualError} = require("./src/utilities/contextualError");

const {Datastore} = require("@google-cloud/datastore");
const {DatastoreDatabaseDriver} = require("./src/datastoreDatabaseDriver");

const {ErrorController} = require("./src/controllers/errorController");
const {NotesController} = require("./src/controllers/notesController");

const {Router} = require("./src/router");
const {Server} = require("./src/server");

const port = process.env.PORT || 8080;
var environment = process.env.NODE_ENV || "development";

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
const server = new Server({environment, port, router});

server.start(function (err) {
    if (err) {
        console.error("Application couldn't be initialized.")
        console.error(err.stack || err.toString());
        return;
    }

    console.log(`Application is running at: http://localhost:${port}/`);
});
