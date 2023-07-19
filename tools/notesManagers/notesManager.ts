import { RemoteNote } from "../../types/note";

export interface NotesManager {
    GetMeNotes: () => Promise<RemoteNote[]>;
    UpdateMeNotes: (note: RemoteNote) => Promise<RemoteNote>;
    CreateMeNotes: (note: RemoteNote) => Promise<RemoteNote>;
    DeleteMeNotes: (noteId: string) => Promise<any>;
}