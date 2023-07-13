// Type: Interface
interface Note {
    id: string;
    title: string;
    content: string;
    preview: string;
    date: string;
    tags: string[];
}

// the type of Notes store in Microsoft Graph
interface RemoteNote {
    id: string;
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

export { Note, RemoteNote, RemoteNoteBody };