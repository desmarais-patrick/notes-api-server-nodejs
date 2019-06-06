"use strict";

// Node module dependencies.
const HTTP = require("http");
const URL = require("url");
const {Datastore} = require("@google-cloud/datastore");

// Application module dependencies.
const ErrorController = require("./src/controllers/errorController");
const NotesController = require("./src/controllers/notesController");
const WelcomeController = require("./src/controllers/welcomeController");

const ContextualError = require("./src/models/contextualError");
const Environment = require("./src/models/Environment");
const ErrorResponse = require("./src/models/errorResponse");
const ListRequest = require("./src/models/listRequest");
const Note = require("./src/models/note");
const SuccessResponse = require("./src/models/successResponse");
const ValidationResult = require("./src/models/validationResult");

const ApiJsonNoteTranslator = require("./src/apiJsonNoteTranslator");
const DatastoreDatabaseDriver = require("./src/datastoreDatabaseDriver");
const DatastoreNoteTranslator = require("./src/datastoreNoteTranslator");

const Router = require("./src/router");
const Server = require("./src/server");

// Variables.
const port = process.env.PORT || 8080;
const environment = new Environment({NODE_ENV: process.env.NODE_ENV});

// Initialization.
const datastore = new Datastore();
const datastoreNoteTranslator = new DatastoreNoteTranslator({
    Note,

    datastore
});
const databaseDriver = new DatastoreDatabaseDriver({
    ContextualError,

    datastore,
    datastoreNoteTranslator
});

const errorController = new ErrorController({
    ErrorResponse,

    environment
});

const apiJsonNoteTranslator = new ApiJsonNoteTranslator({
    Note,
    ValidationResult
});
const notesController = new NotesController({
    ContextualError,
    ErrorResponse,
    SuccessResponse,

    apiJsonNoteTranslator,
    environment,
    databaseDriver
});

const welcomeController = new WelcomeController({
    TextResponse
});

const router = new Router({
    URL,

    ContextualError,
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
