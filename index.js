"use strict";

// Node module dependencies.
const HTTP = require("http");
const URL = require("url");
const {Datastore} = require("@google-cloud/datastore");

// Application module dependencies.
const ErrorController = require("./src/controllers/errorController.js");
const NotesController = require("./src/controllers/notesController.js");
const WelcomeController = require("./src/controllers/welcomeController.js");

const ContextualError = require("./src/models/contextualError.js");
const Environment = require("./src/models/environment.js");
const ErrorResponse = require("./src/models/errorResponse.js");
const ListRequest = require("./src/models/listRequest.js");
const Note = require("./src/models/note.js");
const SuccessResponse = require("./src/models/successResponse.js");
const TextResponse = require("./src/models/textResponse.js");
const ValidationResult = require("./src/models/validationResult.js");

const ApiJsonNoteTranslator = require("./src/apiJsonNoteTranslator.js");
const DatastoreDatabaseDriver = require("./src/datastoreDatabaseDriver.js");
const DatastoreNoteTranslator = require("./src/datastoreNoteTranslator.js");
const NoteValidation = require("./src/noteValidation.js");

const Router = require("./src/router.js");
const Server = require("./src/server.js");

const config = require("./config.js");

// Variables.
const port = process.env.PORT || 8080;
const environment = new Environment({NODE_ENV: process.env.NODE_ENV});
const allowedOrigin = environment.isDev() ? config.devLocal.allowedOrigin : 
    config.prod.allowedOrigin;

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
    Note
});
const noteValidation = new NoteValidation({
    ValidationResult
});
const notesController = new NotesController({
    ContextualError,
    ErrorResponse,
    SuccessResponse,

    apiJsonNoteTranslator,
    environment,
    databaseDriver,
    noteValidation
});

const welcomeController = new WelcomeController({
    TextResponse
});

const router = new Router({
    URL,

    ContextualError,
    ListRequest,

    errorController,
    notesController,
    welcomeController,

    allowedOrigin
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
    console.log(`Application is running at: http://localhost:${port}/`,
        `[Mode: ${environment}]`);
});
