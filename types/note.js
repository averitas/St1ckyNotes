class Note {
    constructor(id="", title="", content="", date="", tags=[]) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.date = date;
        this.tags = tags;
    }
}

export { Note };