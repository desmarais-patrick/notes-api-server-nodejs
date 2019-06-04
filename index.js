"use strict";

// Node module dependencies.
const HTTP = require("http");
const URL = require("url");
const {Datastore} = require("@google-cloud/datastore");

// Application module dependencies.
const ErrorController = require("./src/controllers/errorController");
const NotesController = require("./src/controllers/notesController");

const ListRequest = require("./src/models/listRequest");
const ErrorResponse = require("./src/models/errorResponse");
const SuccessResponse = require("./src/models/successResponse");

const ContextualError = require("./src/utilities/contextualError");

const DatastoreDatabaseDriver = require("./src/datastoreDatabaseDriver");

const Router = require("./src/router");
const Server = require("./src/server");

// Variables.
const port = process.env.PORT || 8080;
const environment = process.env.NODE_ENV || "development";

// Initialization.
const databaseDriver = new DatastoreDatabaseDriver({
    ContextualError,
    Datastore,
});

const errorController = new ErrorController({
    ErrorResponse
});
const notesController = new NotesController({
    ContextualError,
    ErrorResponse,
    SuccessResponse,
    environment,
    databaseDriver
});
const router = new Router({
    URL,
    ListRequest,
    errorController,
    notesController
});

// Server is ready to start.
const server = new Server({
    HTTP,
    port,
    router
});
server.addErrorHandler(function (err) {
    const contextError = new ContextualError(
        "Application couldn't be initialized.", err);
    console.error(contextError.toString());
});
server.start(function () {
    console.log(`Application is running at: http://localhost:${port}/`);
});
