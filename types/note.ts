// Type: Interface
interface Note {
    id: string;
    localId: string // the local index that used to track local status in new note situation.
    title: string;
    content: string;
    preview: string;
    date: string;
    tags: string[];
    isDraft: boolean;
}

// the type of Notes store in Microsoft Graph
interface RemoteNote {
    id: string; // the index that sync with remote.
    createdDateTime: string;
    lastModifiedDateTime: string;
    changeKey: string;
    categories: string[];
    hasAttachments: string;
    subject: string;
    bodyPreview: string;
    body: RemoteNoteBody;
}

interface RemoteNoteBody {
    contentType: string // html or text
    content: string;
}

enum NotesSource {
    local = "local",
    outlook = "outlook",
    onedrive = "onedrive",
    webdav = "webdav",
}

export { Note, RemoteNote, RemoteNoteBody, NotesSource };