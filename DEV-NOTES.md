# Development Notes

## Architecture

**Open-closed router**
@Router, @Routing

 - Adding new routes will involve changing the route function. Open for modification :(
 - How to abstract path finding without hurting performance?
   - Open for extension: new routes in the future.
   - Close for modification...
 - Is this architecture going to look like Express.js then?
   - Do we need to follow such abstraction here?
 - Route class with methods for:
   - Documentation (toString() -> "/notes/{id}")
   - Name, to print in error messages
   - parseBody(), to extract JSON
   - parseParameter(), to extract parameter value
   - isMatch(), to serially compare against priority routes
 - Should route be configured in a separate file, such as swagger.yaml?

**Wrap IncomingMessage and ServerResponse classes**
@Router, @Routing

```
var req = new IncomingMessageWrapper(incomingMessage);
i.getUrlPath(); // To find out if 404!
i.getRoute(); // Returns Route object with name, see open-closed router ideas.
i.getPathParamId("/notes/{id}"); // Returns ID found in URL as string. Input with pattern as to where id is.
i.getBody(callback); // Returns an error or some json object.
i.getQueryParam(field); // Returns any value found for this query param.

var res = new ServerResponse(serverResponse);
res.send(response, callback);
res.sendInChunks(chunkedResponse, callback);
```

**Review data translation**
@Router, @Database, @Controller

 - datastoreNoteTranslation.js and apiJsonNoteTranslation.js
 - Should translation be called parsing?
 - Are there design patterns, maybe similar to validation regarding this?

**Design a new input validation approach**
@DataValidation, @Router, @Controller, @Model

 - Are there design patterns to validate input?
   - Hint: ETL software architecture.
   - Keywords: data translation, validation, load.
 - Where should we place validation? Controller, model, ApiJsonParser?
 - How strict should the input be checked?

**Data format as configuration?**
@DataValidation, @Configuration

 - ID format as integer, date format at ISO-8601, text length...
 - The ID is dependent on database in Google Cloud.
 - Are these good formats for the application, technology?
 - Should format validation be configurable? What's the advantage?

**Abstract database used**
@Database

Avoid being closed to using one infrastructure.

 - Inspect creation of an ORM.
 - Inspect creation of a simple JSON file database equivalent for local development.
 - Inspect data utilities for export and import from/to various formats.

 - Create a template project from this one.

**Interface for DatabaseDriver**
@Database

 - Interface for update/insert isn't well abstracted.
 - Should we create new models for NewNote (create) and PartialNote (update)?
   - Validation could then be clearly linked to those models.

**Review how to use ID**
@DataModel

 - Should I generate my own ID field?
 - How are the database capabilities in creating IDs atomically (increment and get)?
   - How would one keep the meta information about IDs in a table or document DB?
   - Is updating an ID about reading the whole database and compute an aggregate?
   - Maybe a document database isn't the way then!
 - Is an ID relevant?

**Version API**
@Router

 - To be able to do updates on the client and server
 - To remember to be retro-compatible

**Content types for create requests**
@DataModel, @Router

 - Do something with content type.
 - What happens if ASCII characters are sent instead of UTF-8?



## Checklist

 - API documentation at the root (welcomeController)
 - JavaScript linting
 - Unit tests (and coverage)
 - End-to-end integration tests (and coverage)
 - Performance tests
   - See the effect between versions.
 - Public method assertions
 - Scripts to set environment variables (dev, prod)
 - Deploy different environments remotely (start them locally, staging)
 - Process from design to developing a new feature in this project
 - Add back `.js` to the required module to make it easier to read.

### JavaScript Linting and Conventions

 - Class private variables
 - Options property names
 - Empty lines between statements

### Security

 - Request timeout
 - Database not available
 - ID in the URL path
 - Client app secret
 - Rate limiting (429)
 - Health status

## Questions

**Software development**

 - What does it mean: "don't be penny-wise, pound-foolish"?

**@GoogleCloud**

 - How to return entity that has been created?
   - Should it be returned? Double payload?
   - Return only ID?
 - How to return updated entity to re-create the updated model?
   - To avoid merging and validation rules on the client.
 - How to detect a 404 (not found) when attempting an update?
 - Why is there a token for paging? Isn't the order guaranteed by indexes?
 - How to know how many entities are stored of one kind since no aggregation?
 - How to set environment variables on App Engine?

**@Web development**

 - Is URL path completely visible in a HTTPS request?
 - Is ID of object in URL a privacy concern?
 - Can client applications process chunked responses?
 - Does it make sense to reply 304 in an API server? Request with timestamp?

**@Node.js**

 - Can keeping an input value only for error message purposes cause leaking?
   - Callback scope and clojure leaking...how to detect this?
 - Why doesn't Node.js support CommonJS (ES6) modules?
   - Module systems, caching, loading? Web vs. Node?
 - How to use promise in Node.js? Or async/await?
   - What does it imply for writing code? Performance? Limitations?
   - Read methods in the caolin/async module.

**Research by curiosity**

 - Look how responses are dispatched (headers used) in Express.js
 - How do `.env` files configure environment variables?
 - How does the @google-cloud/datastore work? (HTTP/2, timeout, etc.)

## Google Cloud Articles

  - Life of a Datastore Write

  - An Overview of App Engine
  - Structuring Web service in App Engine
  - Communicating between your services
  - Testing and deploying your application
  - Understanding Data and File Storage
  - Serving Static files
  - How Requests are Routed

  - Configuring Datastore Indexes
  - How Entities and Indexes are Stored
  - Index Selection and Advanced Search

  - Securing Custom Domains with SSL
  - Mapping Custom Domains
  - Strict Transport Security

  - Dispatch.yaml Configuration File
  - Defining Runtime Settings
  - Specifying dependencies

  - Writing Application Logs
  - Profiling Node.js code

  - Express.static middleware (see options)

  - Building scalable and resilient applications
  - Microservices Architecture on Google App Engine
  - Naming Developer Environments
  - Contracts, Addressing, and APIs for Microservices
  - Best Practices for Microservices Performance

  - Implementing workflows on Google App Engine with Fantasm
  - Optimizing Spring Framework for App Engine Applications
  - Updating your Model's Schema
  - Modeling Entity Relationships
  - Best Practices for App Engine Memcache
