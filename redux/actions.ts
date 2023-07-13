import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../redux/store';
import { setNotes } from '../redux/notesSlice';
import { GetMeNotes } from '../tools/graph';
import { Note, RemoteNote } from '../types/note';

export const fetchNotesAsync = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    if (rootState.authReducer.AuthResult === null) {
        return []
    }
    const { accessToken } = rootState.authReducer.AuthResult;
    var rawNotes = await GetMeNotes(accessToken);

    var notesList: Note[] = [];
    rawNotes.forEach(remoteNote => {
        notesList.push({
            id: remoteNote.id,
            title: remoteNote.subject,
            content: remoteNote.body.content,
            date: remoteNote.lastModifiedDateTime,
            tags: remoteNote.categories,
            preview: remoteNote.bodyPreview.length > 50 ? remoteNote.bodyPreview.substring(0, 50) : remoteNote.bodyPreview
        })
    });

    return notesList;
  }
);