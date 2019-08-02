const {Datastore} = require("@google-cloud/datastore");
const Note = require("../src/models/note");
const DatastoreNoteTranslator = require("../src/datastoreNoteTranslator");

var test = function () {
    console.log("Test has started");

    var datastore = new Datastore();
    const datastoreNoteTranslator = new DatastoreNoteTranslator({
        Note,
    
        datastore
    });

    var noteText = randomText();
    var noteDate = new Date();
    var note = new Note()
        .setText(noteText)
        .setDate(noteDate);
    
    

    var formattedNote = datastoreNoteTranslator.format(note);
    var datastoreKey = formattedNote.key;
    assertEquals(typeof datastoreKey.id, "undefined", "Key ID is not set");

    // Create a note.
    debugger;
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
        note.setId(datastoreKey.id);

        var newNoteText = noteText + " (new version)";
        note.setText(newNoteText);
        var newFormattedNote = datastoreNoteTranslator.format(note);
        var newDatastoreKey = newFormattedNote.key;
        assertEquals(newDatastoreKey.name, note.id, "New key name is note ID");

        debugger;

        // Update the note with new text.
        var noteId = note.id;
        datastore.update(newFormattedNote, function (err) {
            assertEquals(err, null, "Datastore was ready for update");

            debugger;
            // Get the note.
            var getKey = datastore.key(["Note", noteId]);
            datastore.get(getKey, function (err, entity) {
                assertEquals(err, null, "Datastore was ready for get");

                // Check note received.
                assertEquals(typeof entity[datastore.KEY].id, "undefined",
                    "ID is not under meta ID");
                assertEquals(entity[datastore.KEY].name, noteId,
                    "ID is under meta NAME");
                assertEquals(entity.text, newNoteText, "Retrieved new text");
                assertEquals(typeof entity.date, "object", "Retrieved some date");

                var getNote = datastoreNoteTranslator.read(entity);
                assertEquals(getNote.id, noteId,
                    "Datastore retrieved good note");
                assertEquals(getNote.text, newNoteText);

                debugger;
                // Query for notes.
                var query = datastore.createQuery(["Note"])
                    .order("date", {
                        descending: true,
                    });
                datastore.runQuery(query, function (err, entities) {
                    assertEquals(err, null, "Datastore was ready for query");
                    var lastEntity = entities.shift(); // Most recent are at the top.

                    // Check note received.
                    assertEquals(typeof lastEntity[datastore.KEY].id, "undefined",
                        "ID is not under meta ID");
                    assertEquals(lastEntity[datastore.KEY].name, noteId,
                        "ID is under meta NAME");
                    assertEquals(lastEntity.text, newNoteText, "Retrieved new text");
                    assertEquals(typeof lastEntity.date, "object", "Retrieved some date");

                    var queryNote = datastoreNoteTranslator.read(lastEntity);
                    assertEquals(queryNote.id, noteId,
                        "Datastore retrieved good note");
                    assertEquals(queryNote.text, newNoteText);

                    debugger;
                    console.log("Test has ended");
                }); // END query for notes.
            }); // END get note.
        }); // END update note.
    }); // END create note.
}; // END test.

var assertEquals = function (a, b, reason) {
    assert(a === b,
        "Expected '" + a + "' to equal '" + b + "' while checking for " + 
            reason);
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
