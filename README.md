# API Server

This Node.js server runs the API server for the Notes project.
The following sections have been divided into:

 - [Running on Google Cloud](#running-on-google-cloud)
 - [Running locally](#running-locally)
 - [Running tests](#running-tests)
 - [References](#references)

See also mother [notes](/desmarais-patrick/notes) repo for global information about the project.

<!-- TODO Overview of project structure. -->

## Running on Google Cloud

To run this server using a standard App Engine on Google Cloud,
you will need the following pre-requisites:

 - Google Cloud account with billing enabled
 - Google Cloud `PROJECT_ID`
 - Google Cloud App Engine app (Node.js, standard) created
 - Google Cloud Firestore with Datastore API enabled (see [Enable API flow](https://console.cloud.google.com/flows/enableapi?apiid=datastore.googleapis.com))

Optionally, you may install *Node.js* and *Google Cloud SDK* locally to run commands otherwise run using *Google Cloud Shell*.

### Steps to deploy

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
gcloud app deploy --version <VERSION>
```

The `<VERSION>` may be specified as `0-0-1` for version 0.0.1.

After a few minutes, you should then be able to visit your project's URL (generally of the form `https://<PROJECT_ID>.appspot.com`) to see the API.

If you wish to deploy a version without making it active to receive traffic, say for testing deployment or modifications, you may use the flag `--no-promote`.

---

Optionally, if you want to deploy using the *Google Cloud SDK* on your machine, a useful command to login to GCP services is:

```
gcloud auth application-default login
```

The above commands work too.

### Environment considerations

If you plan on creating different environments, for example *development* and *demo* and *prod*, the easiest way to manage those environments with the Google Cloud Datastore seems to create different projects.

<!-- TODO Describe demo version with rate limiting (1000 requests or 100KB per hour) + reset every hour. -->


### Export/import data

If you want to create an export of your remote Datastore data [[3](#references)], you may create a (regional) Storage bucket, say `notes-123456-datastore-exports` for the project `notes-123456`.

Then, run the following commands, while under your Google Cloud project and user login in your shell:

```
PROJECT_ID="notes-123456"
BUCKET="notes-123456-datastore-exports"
gcloud datastore export --namespaces="(default)" gs://${BUCKET}/some-export-name
```

To import back [[3](#references), locate the *PATH* your `some-export-name.overall_export_metadata` *FILE*, and then run the command:

```
gcloud datastore import gs://${BUCKET}/[PATH]/[FILE].overall_export_metadata
```

> If only bucket name is specified, without export name, the *PATH* and *FILE* parts are a timestamp.

To download the export locally [[4](#references)], you may use the following command:

```
gsutil cp -r gs://notes-238418-datastore-exports/2019-05-31T15:02:21_75560 .
```

To upload, just switch arguments! 😉


### Steps to clean up

Checklist:

 - AppEngine app
 - Storage buckets
 - Datastore entities (Firestore with Datastore)

If you wish to remove older versions, you may visit the App Engine dashboard section in the *Google Cloud Console*.

If you wish to clean things completely, you may delete the Google Cloud project itself. 😉

[Back to top ↑](#)



## Running locally

To run this server locally, you will need the following pre-requisites:

 - Node.js
 - [notes-db-server-datastore](/desmarais-patrick/notes-db-server-datastore) setup (local or remote)

> Note: *Google Cloud Console* offers *Google Cloud Shell* which enables to edit and run code on a cloud instance. If you plan on using Shell, configurations will require a few tweaks to choose the correct datastore.

### Steps

Install NPM dependencies:

```
npm install
```

Run API server using:

```
npm start
```

Visit `http://localhost:8080/` to start using the API.

> Note if the `PORT` environment variable is set on your system, replace `8080` by its value to start using the API.

> Note that running the app locally, with the Google Cloud login and project setup, accesses your project's remote database in the cloud. 😉

### Debugging

Start server with:

```
npm run-script debug
```

Open Chrome browser and type in address bar:

```
chrome://inspect
```

Click on link to *Open dedicated DevTools for Node*.

In the debug window that opens, you may set your breakpoints under the *Source* tab.


### Documentation

No API documentation has been generated yet. 😕

<!-- TODO Open API documentation, such as Open-API user interface. -->

### Using a local database

<!-- TODO Create scripts to switch between local and remote datastores. -->
<!-- TODO Create scripts to switch between environments (projects). -->
<!-- TODO Add script to pull sample data using export storage bucket. -->

Google Cloud offers a *Datastore emulator* [[1](#references)].
To run this emulator locally...

**Install** emulator:

```
gcloud components install cloud-datastore-emulator
```

**Start** emulator in the project's folder:

```
gcloud beta emulators datastore start --data-dir=data
```

Before running the API server with the local database, set the environment variables described by the following command [[1](#references)]:

```
gcloud beta emulators datastore env-init --data-dir=data
```

> This prints the commands to run to set the environment variables.

> To run the commands listed, use command substitution `$(gcloud beta...)`.

Once the local datastore is running, **import** some data [[2](#references)]:

```
curl -X POST localhost:8081/v1/projects/notes-238418:import \
 -H 'Content-Type: application/json' \
 -d '{"input_url":"data-fixtures/small-dataset-01/small-dataset-01.overall_export_metadata"}'
```

> If you wish to insert some data from a remote datastore, you may refer to exporting data in the [Running Remotely](#running-remotely) section.

To **export** the data from the emulator [[2](#references)], you may apply:

```
curl -X POST localhost:8081/v1/projects/[PROJECT_ID]:export \
 -H 'Content-Type: application/json' \
 -d '{"output_url_prefix":"data-fixtures/small-dataset-02"}'
```

To **clean-up**, first, you may reset your environment variables to reconnect to the remote datastore:

```
gcloud beta emulators datastore env-unset --data-dir=data
```

Then, you may remove the data directory contents:

```
rm -rf data/*
```

[Back to top ↑](#)

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

[Back to top ↑](#)



## References

[1] Google Cloud. *Running the Datastore mode Emulator*.
    https://cloud.google.com/datastore/docs/tools/datastore-emulator

 - Section on [Installing the emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator#installing_the_emulator)
 - Section on [Setting the environment variables](https://cloud.google.com/datastore/docs/tools/datastore-emulator#setting_environment_variables)

[2] Google Cloud. *Exporting and Importing Emulator Data*.
    https://cloud.google.com/datastore/docs/tools/emulator-export-import

[3] Google Cloud. *Exporting and Importing Entities*.
    https://cloud.google.com/datastore/docs/export-import-entities

[4] Google Cloud. *cp - Copy files and objects*.
    https://cloud.google.com/storage/docs/gsutil/commands/cp

[Back to top ↑](#)
