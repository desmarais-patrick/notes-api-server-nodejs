const {Datastore} = require("@google-cloud/datastore");
const Note = require("../src/models/note");
const DatastoreNoteTranslator = require("../src/datastoreNoteTranslator");

// This is a live test to understand how datastore works.
// Subjects of experiment:
//   - Keys and identifiers for entities stored in datastore.
//   - Interaction between classes for parsing and formatting with datastore.
//   - Returning identifier after creation.
var test = function () {
    console.log("--- Test has started! ---");

    var datastore = new Datastore();
    const datastoreNoteTranslator = new DatastoreNoteTranslator({
        Note,
    
        datastore
    });

    console.log(" >  Insert a new note");
    var noteText = randomText();
    var noteDate = new Date();
    var note = new Note()
        .setText(noteText)
        .setDate(noteDate);

    var formattedNote = datastoreNoteTranslator.format(note);
    var datastoreKey = formattedNote.key;
    assertEquals(typeof datastoreKey.id, "undefined", "Key ID is not set before create.");

    datastore.insert(formattedNote, function (err, results) {
        assertEquals(err, null, "Datastore was ready for create");

        assertEquals(typeof results, "object", "Results are available");
        assertEquals(typeof results.mutationResults[0].key.path[0].id, "string",
            "ID is returned");
        assertEquals(results.mutationResults[0].key.path[0].idType, "id",
            "Expected ID type is 'id'");
        assertEquals(results.mutationResults[0].key.path[0].kind, "Note",
            "Expected kind is 'Note'");

        assertEquals(typeof datastoreKey.id, "string",
            "Key ID is now defined! ");
        assertEquals(isNaN(parseInt(datastoreKey.id, 10)), false,
            "Datastore key can be parsed as integer.");

        console.log("(!) Created note with ID", datastoreKey.id);

        note.setId(datastoreKey.id);

        console.log(" >  Update note with new text");
        var newNoteText = noteText + " (new version)";
        note.setText(newNoteText);
        var newFormattedNote = datastoreNoteTranslator.format(note);
        var newDatastoreKey = newFormattedNote.key;
        assertEquals(newDatastoreKey.id, parseInt(note.id, 10), 
            "Key ID is note ID before update");

        var noteId = note.id;
        datastore.update(newFormattedNote, function (err) {
            assertEquals(err, null, "Datastore was ready for update");

            console.log(" >  Get updated note");
            var numericNoteId = parseInt(noteId, 10);
            // NOTE: When creating a key with a string identifier,
            //         it's considered a name.
            //       When creating a key with a number identifier,
            //         it's considered an id.
            var getKey = datastore.key(["Note", numericNoteId]);
            datastore.get(getKey, function (err, entity) {
                assertEquals(err, null, "Datastore was ready for get");

                // Check entity received.
                assertEquals(entity[datastore.KEY].id, noteId,
                    "ID under key ID is same as note ID");
                assertEquals(typeof entity[datastore.KEY].name, "undefined",
                    "ID under key NAME is not defined");
                // NOTE: When saving a note with a **string** ID,
                //         it stores it under `id` in key before request.
                //         and then returns it under `name` in key in response.
                //       When saving a note with a **numeric** ID,
                //         it stores it under `id` in key before request
                //         and it's still a number before request,
                //         and then returns it under `id` in key as string
                //         in response.
                // TODO Investigate if allocating an ID avoids this situation,
                //      since we wish to return ID after creation.

                assertEquals(entity.text, newNoteText,
                    "Retrieved text matches newly updated text");
                assertEquals(typeof entity.date, "object",
                    "Retrieved some date too");

                // Check entity parsing to note.
                var getNote = datastoreNoteTranslator.read(entity);
                assertEquals(getNote.id, noteId,
                    "Note ID could be parsed successfully.");
                assertEquals(getNote.text, newNoteText, "Texts match");

                console.log(" >  Get note as part of a list");
                var query = datastore.createQuery(["Note"])
                    .order("date", {
                        descending: true,
                    });
                datastore.runQuery(query, function (err, entities) {
                    assertEquals(err, null, "Datastore was ready for query");
                    var lastEntity = entities.shift();
                        // Most recent notes are at the top.

                    // Check note received.
                    assertEquals(typeof lastEntity[datastore.KEY].name,
                        "undefined", "Key name is not set");
                    assertEquals(lastEntity[datastore.KEY].id, noteId,
                        "ID is under key ID");
                    assertEquals(lastEntity.text, newNoteText, "Retrieved new text");
                    assertEquals(typeof lastEntity.date, "object", "Retrieved some date");

                    var queryNote = datastoreNoteTranslator.read(lastEntity);
                    assertEquals(queryNote.id, noteId,
                        "Note ID could be parsed successfully.");
                    assertEquals(queryNote.text, newNoteText, "Texts match");

                    console.log(" >  Delete created note");
                    datastore.delete(getKey, function (err, results) {
                        assertEquals(err, null,
                            "Datastore was ready for delete");

                        console.log("(!) Deleted note with ID", datastoreKey.id);
                        debugger;
                        
                        console.log("--- Test has ended successfully! ---"); 
                    }); // END delete note.
                }); // END query for notes.
            }); // END get note.
        }); // END update note.
    }); // END create note.
}; // END test.

var assertEquals = function (a, b, reason) {
    var condition = (a === b);
    var newReason = (condition === false) ?
        "Expected '" + a + "' to equal '" + b +
            "' while checking for " + reason :
        reason;

    assert(condition, newReason);
};

var assert = function (condition, reason) {
    if (condition === false) {
        var message = "✘ Assertion failed " + reason || "";
        console.error(message);
        debugger;
        throw new Error(message);
    }
    console.log("😃", reason);
}

var dictionary = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, " ", "."];
var randomText = function () {
    var randIndex;
    var max = dictionary.length;
    var text = new Array(20);
    for (var i = 0; i < 20; i++) {
        randIndex = Math.floor(Math.random() * max);
        text.push(dictionary[randIndex]);
    }
    return text.join("");
}

setTimeout(function () {
    try {
        test();
    } catch (err) {
        debugger;
        throw err;
    }
}, 2000);
