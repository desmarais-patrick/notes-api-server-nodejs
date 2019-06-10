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

**Design a new input validation approach**
@DataValidation, @Router, @Controller, @Model

 - Are there design patterns to validate input?
   - Hint: ETL software architecture.
   - Keywords: data translation, validation, load.
 - Where should we place validation? Controller, model, ApiJsonParser?

**Data format as configuration?**
@DataValidation, @Configuration

 - ID format as integer, date format at ISO-8601, text length...
 - The ID is dependent on database in Google Cloud.
 - Are these good formats for the application, technology?
 - Should format validation be configurable? What's the advantage?

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

## Checklist

 - API documentation at the root (welcomeController)
 - JavaScript linting
 - Unit tests (and coverage)
 - End-to-end integration tests (and coverage)
 - Performance tests
   - See the effect between versions.
 - Public method assertions

### JavaScript Linting and Conventions

 - Class private variables
 - Options property names
 - Empty lines between statements

### Security

 - Request timeout
 - Database not available
 - ID in the URL path
 - Client app secret

## Questions

**@GoogleCloud**

 - How to return entity that has been created?
   - Should it be returned? Double payload?
   - Return only ID?
 - How to return updated entity to re-create the updated model?
   - To avoid merging and validation rules on the client.
 - How to detect a 404 (not found) when attempting an update?

**@Web development**

 - Is URL path completely visible in a HTTPS request?
 - Is ID of object in URL a privacy concern?

**@Node.js**

 - Can keeping an input value only for error message purposes cause leaking?
   - Callback scope and clojure leaking...how to detect this?

