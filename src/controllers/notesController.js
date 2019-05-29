const {BaseController} = require("./baseController");

class NotesController extends BaseController {
    constructor() {
        super();
    }

    create(requestBody, callback) {
        callback(new Error("notesController.create [Not yet implemented]"));
    }

    list(httpResponse) {
        const data = {
            type: "Collection",
            items: [
                {
                    type: "Note",
                    id: 1,
                    text: "TED talk, Shawn Achor, Happiness",
                    date: "2019-03-02T22:03:12.1234Z"
                },
                {
                    type: "Note",
                    id: 2,
                    text: "Movies\n\nIron Man I\nCaptain America I\nCaptain Marvel\nAvengers: Endgame\n",
                    date: "2019-03-02T21:34:45.1234Z"
                },
                {
                    type: "Note",
                    id: 3,
                    text: "Move On, A Real Good Kid, Mike Posner",
                    date: "2019-03-01T09:32:12.1234Z"
                }
            ],
            total: 3,
            limit: 10,
            offset: 0,
            next: null,
            previous: null
        };

        this.sendJson(200, data, httpResponse);
    }

    get(id, callback) {
        callback(new Error("notesController.get [Not yet implemented]"));
    }

    update(id, requestBody, callback) {
        callback(new Error("notesController.update [Not yet implemented]"));
    }

    delete(id, callback) {
        callback(new Error("notesController.delete [Not yet implemented]"));
    }
}

module.exports = {
    NotesController: NotesController
};
