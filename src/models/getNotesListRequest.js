class GetNotesListRequest {
    constructor(limit, offset, user) {
        this.limit = limit;
        this.offset = offset;
        this.user = user;
    }
}

module.exports = GetNotesListRequest;
