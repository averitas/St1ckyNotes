import { Note } from "../types/note";

// A mock function to mimic making an async request for data
export function fetchNotes() {
    return new Promise<{ data: Note[] }>((resolve) =>
      setTimeout(() => resolve({ data: [] }), 500)
    );
  }