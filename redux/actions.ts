import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk, RootState } from '../redux/store';
import { GetNotesManager, SetNotesManager, deleteNote, updateNote } from '../redux/notesSlice';
import { GraphNotesManager } from '../tools/notesManagers/graph';
import { Note, NotesSource, RemoteNote } from '../types/note';
import { selectAccessToken, selectNotesSource } from './selectors';
import { MSALWebviewParams } from 'react-native-msal';
import { GetB2cClient, InitMsalB2cClient } from './authSlice';
import { config } from '../tools/msal';
import { v4 as uuidv4 } from 'uuid';

/// Notes Thunks functions
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const initNotesManager =
  (): AppThunk =>
  (dispatch, getState) => {
    const sourceType = selectNotesSource(getState());

    switch (sourceType) {
      case NotesSource.outlook:
        const accessToken = selectAccessToken(getState());
        if (!accessToken) {
          throw new Error('Access token is null, cannot init notes manager.');
        }
        console.log("Init Graph notes manager with access token: " + accessToken)
        SetNotesManager(new GraphNotesManager(accessToken));
        break;

      default:
        console.error(`Invalid source type: [${sourceType}}], not ready yet.`);
        break;
    }
};

export const GetAvatarAsync = createAsyncThunk(
  'notes/getAvatar',
  async (_, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    if (!rootState.authReducer.AuthResult) {
        console.log("AuthResult is null, cannot fetch avatar.");
        return [];
    }

    if (!GetNotesManager()) {
        dispatch(initNotesManager());
    }
    console.log("Notes Manager is: " + GetNotesManager());
    try {
      const avatar = await GetNotesManager().GetAvatar();
      return URL.createObjectURL(avatar);
    } catch(err) {
      console.log('Failed to catch avatar!');
      return null;
    }
  }
);

export const FetchNotesAsync = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    if (!rootState.authReducer.AuthResult) {
        console.log("AuthResult is null, cannot fetch notes.");
        return []
    }

    if (!GetNotesManager()) {
        dispatch(initNotesManager());
    }
    console.log("Notes Manager is: " + GetNotesManager())
    var rawNotes = await GetNotesManager().GetMeNotes();

    var notesList: Note[] = [];
    rawNotes.forEach(remoteNote => {
        notesList.push({
            id: remoteNote.id,
            title: remoteNote.subject,
            content: remoteNote.body.content,
            date: new Date(remoteNote.lastModifiedDateTime).toISOString(),
            tags: remoteNote.categories,
            preview: remoteNote.bodyPreview.substring(0, 50),
            isDraft: false,
            localId: uuidv4(),
        })
    });

    return notesList;
  }
);

// create new note please call addBlankNote function first.
export const UpdateNotesAsync = createAsyncThunk(
  'notes/updateNotes',
  async (NoteToUpdate: Note, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    if (!rootState.authReducer.AuthResult) {
        console.log("AuthResult is null, cannot update notes.");
        return null
    }

    if (!GetNotesManager()) {
        dispatch(initNotesManager());
    }
    var rawNotesToUpdate: RemoteNote = {
        id: NoteToUpdate.id,
        categories: NoteToUpdate.tags,
        subject: NoteToUpdate.title,
        body: {
            contentType: "html",
            content: NoteToUpdate.content
        },
    } as RemoteNote;

    const resp = await GetNotesManager().UpdateMeNotes(rawNotesToUpdate);

    // update the existing note timestamp
    const newNote = {...NoteToUpdate,
      date: new Date().toISOString(),
      preview: resp.bodyPreview.substring(0, 50),
    } as Note;
    dispatch(updateNote(newNote));
    return newNote;
  }
);

export const CreateNotesAsync = createAsyncThunk(
  'notes/createNotes',
  async (NoteToUpdate: Note, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    if (!rootState.authReducer.AuthResult) {
        console.log("AuthResult is null, cannot create notes.");
        return null
    }

    if (!GetNotesManager()) {
        dispatch(initNotesManager());
    }
    var rawNotesToUpdate: RemoteNote = {
        categories: NoteToUpdate.tags,
        subject: NoteToUpdate.title,
        body: {
            contentType: "html",
            content: NoteToUpdate.content
        },
    } as RemoteNote;

    const resp = await GetNotesManager().CreateMeNotes(rawNotesToUpdate);

    const newNote = {
      ...NoteToUpdate,
      date: new Date().toISOString(),
      isDraft: false,
      preview: resp.bodyPreview.substring(0, 50),
      id: resp.id,
    } as Note;
    // update the existing note timestamp
    dispatch(updateNote(newNote));
    return newNote;
  }
);

export const DeleteNotesAsync = createAsyncThunk(
  'notes/deleteNotes',
  async (NoteToUpdate: Note, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    if (!rootState.authReducer.AuthResult) {
        console.log("AuthResult is null, cannot delete notes.");
        return []
    }

    if (!GetNotesManager()) {
        dispatch(initNotesManager());
    }
    const resp = await GetNotesManager().DeleteMeNotes(NoteToUpdate.id);

    // update the existing note timestamp
    dispatch(deleteNote(NoteToUpdate));
    return resp;
  }
);

/// Auth Thunks functions

// async actions
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (webviewParameters: MSALWebviewParams, { getState }) => {
      const b2cClient = GetB2cClient();
      if (!b2cClient) {
          throw new Error("b2cClient is null");
      }
      try {
          const res = await b2cClient.signIn({ scopes: config.auth.scopes, webviewParameters });
          return res;
      } catch (error) {
          console.warn(error);
      }
      // The value we return becomes the `fulfilled` action payload
      return null;
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { getState, dispatch }) => {
    const b2cClient = GetB2cClient();
      if (!b2cClient) {
          throw new Error("b2cClient is null");
      }
      try {
          await b2cClient.signOut();
      } catch (error) {
          console.warn(error);
      }
  }
);

export const initAsync = createAsyncThunk(
  'auth/initAsync',
  async (_, { getState, dispatch }) => {
      if (!GetB2cClient()) {
          InitMsalB2cClient();
      }
      const b2cClient = GetB2cClient();
      try {
          await b2cClient.init();
          const isSignedIn = await b2cClient.isSignedIn();
          if (isSignedIn) {
            return await b2cClient.acquireTokenSilent({ scopes: config.auth.scopes });
          }
          console.log("auth client init complete");
      } catch (error) {
          console.error(error);
      }
      return null;
  }
);

export const acquireTokenAsync = createAsyncThunk(
  'auth/acquireTokenAsync',
  async (forceRefresh: boolean, { getState }) => {
      const b2cClient = GetB2cClient();
      if (!b2cClient) {
          throw new Error("b2cClient is null");
      }
      try {
          const res = await b2cClient.acquireTokenSilent({ scopes: config.auth.scopes, forceRefresh: forceRefresh });
          return res;
      } catch (error) {
          console.warn(error);
      }
      return null;
  }
);
