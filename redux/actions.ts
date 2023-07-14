import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, AppThunk, RootState } from '../redux/store';
import { GetNotesManager, SetNotesManager } from '../redux/notesSlice';
import { GraphNotesManager } from '../tools/notesManagers/graph';
import { Note, NotesSource, RemoteNote } from '../types/note';
import { selectAccessToken, selectNotesSource } from './selectors';
import { MSALWebviewParams } from 'react-native-msal';
import { GetB2cClient, InitMsalB2cClient } from './authSlice';
import { config } from '../tools/msal';

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

export const fetchNotesAsync = createAsyncThunk(
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
            date: remoteNote.lastModifiedDateTime,
            tags: remoteNote.categories,
            preview: remoteNote.bodyPreview.length > 50 ? remoteNote.bodyPreview.substring(0, 50) : remoteNote.bodyPreview
        })
    });

    return notesList;
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
