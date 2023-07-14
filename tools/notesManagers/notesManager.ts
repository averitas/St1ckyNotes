import { RemoteNote } from "../../types/note";

export interface NotesManager {
    GetMeNotes: () => Promise<RemoteNote[]>;
    UpdateMeNotes: (note: RemoteNote) => Promise<any>;
    CreateMeNotes: (note: RemoteNote) => Promise<any>;
    DeleteMeNotes: (noteId: string) => Promise<any>;
}