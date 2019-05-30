# API Server

This Node.js server runs the API server for the Notes project.
The following sections have been divided into:

 - [Running on Google Cloud](#running-on-google-cloud)
 - [Running locally](#running-locally)
 - [Running tests](#running-tests)

This API server works closely with the [database server](/desmarais-patrick/notes-db-server-datastore) project using Google Cloud Datastore.

See also mother [notes](/desmarais-patrick/notes) repo for global information about the project.

<!-- TODO Overview of project structure. -->

## Running on Google Cloud

To run this server using a standard App Engine on Google Cloud,
you will need the following pre-requisites:

 - Google Cloud account with billing enabled
 - Google Cloud project ID
 - Google Cloud App Engine app created
 - Database server setup (see [notes-db-server-datastore](/desmarais-patrick/notes-db-server-datastore) repo)

Optionally, you may install *Node.js* and *Google Cloud SDK* locally to run commands otherwise run using *Google Cloud Shell*.

### Steps

First, open the *Google Cloud Shell* from the *Google Cloud Console* shell icon.

Then, make sure you're on the right project.
Here are some useful Shell commands:

 * `gcloud auth list`, to see which account is active.
 * `gcloud config list project`, to see which project is current.
 * `gcloud config set project <PROJECT_ID>`, to set current project.

Clone this project to your Shell instance:

```
git clone https://github.com/desmarais-patrick/notes-api-server-nodejs.git
```

Deploy the application:

```
gcloud app deploy
```

<!-- TODO Versioning considerations. -->
<!-- TODO Configuration considerations, ex. Datastore, demo environment. -->
<!-- TODO Describe demo version with rate limiting (1000 requests or 100KB per hour) + reset every hour. -->
<!-- TODO Clean-up considerations, ex. remove older versions, remove altogether. -->

If you want to deploy using the *Google Cloud SDK* on your machine, a useful command to login to GCP services is:

```
gcloud auth application-default login
```

The above commands work too.

## Running locally

To run this server locally, you will need the following pre-requisites:

 - Node.js
 - [notes-db-server-datastore](/desmarais-patrick/notes-db-server-datastore) setup (local or remote)

<!-- TODO Configuration considerations, ex. Datastore emulator, remote Datastore, development environment, demo environment, test environment. -->
<!-- TODO Fixture considerations, ex. link to database project. -->
<!-- TODO Cleanup considerations, ex. remove emulator. -->

> Note: *Google Cloud Console* offers *Google Cloud Shell* which enables to edit and run code on a cloud instance. If you plan on using Shell, configurations will require a few tweaks to choose the correct datastore.

<!-- TODO Open API documentation, such as Open-API user interface. -->

### Steps

<!--
Install dependencies:

```
npm install
```
-->

This project has no package dependencies yet. 🤷‍

Run API server using:

```
npm start
```

Visit `http://localhost:8080/` to start using the API.

> Note if the `PORT` environment variable is set on your system, replace `8080` by its value to start using the API.

No documentation has been generated for this API yet. 😕


## Running tests

No tests have been implemented yet. 😕

<!--

Install dependencies:

```
npm install --dev
```

### Tests

Check code syntax:

```
npm run lint
```

Run unit tests:

```
npm run unit-tests
```

Run integration tests:

```
npm run integration-tests
```
-->

<!-- TODO Environment considerations, ex. run tests on dev, demo, prod. -->
<!-- TODO Describe what I mean by automated tests, level of details into writing tests. -->
