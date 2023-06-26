import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';
import { fetchNotes } from './notesApi';
import { notesListStatus } from './actionType';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { MSALResult, MSALWebviewParams } from 'react-native-msal';
import { B2CClient, config } from '../tools/msal';

/// Init State
export interface AuthState {
    AuthResult: MSALResult | null;
    iosEphemeralSession: boolean;
    webviewParameters: MSALWebviewParams;
    status: notesListStatus;
}

const initialState: AuthState = {
    AuthResult: null,
    iosEphemeralSession: false,
    webviewParameters: {
        ios_prefersEphemeralWebBrowserSession: false,
    },
    status: notesListStatus.idle,
};

const b2cClient = new B2CClient(config);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setAuthResult: (state, action: PayloadAction<MSALResult>) => {
            state.AuthResult = action.payload;
        },
        setIosEphemeralSession: (state, action: PayloadAction<boolean>) => {
            state.iosEphemeralSession = action.payload;
            state.webviewParameters.ios_prefersEphemeralWebBrowserSession = action.payload;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginAsync.pending, (state) => {
            state.status = notesListStatus.loading;
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = notesListStatus.idle;
            state.AuthResult = action.payload;
        })
        .addCase(logoutAsync.pending, (state) => {
            state.status = notesListStatus.loading;
        })
        .addCase(logoutAsync.fulfilled, (state) => {
            state.status = notesListStatus.idle;
            state.AuthResult = null;
        })
        .addCase(initAsync.pending, (state) => {
            state.status = notesListStatus.loading;
        })
        .addCase(initAsync.fulfilled, (state, action) => {
            state.status = notesListStatus.idle;
            state.AuthResult = action.payload;
        })
        .addCase(acquireTokenAsync.pending, (state) => {
            state.status = notesListStatus.loading;
        })
        .addCase(acquireTokenAsync.fulfilled, (state, action) => {
            state.status = notesListStatus.idle;
            state.AuthResult = action.payload;
        });
    }
});

// async actions
export const loginAsync = createAsyncThunk(
    'auth/loginAsync',
    async (webviewParameters: MSALWebviewParams) => {
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
    async () => {
        try {
            await b2cClient.signOut();
        } catch (error) {
            console.warn(error);
        }
    }
);

export const initAsync = createAsyncThunk(
    'auth/initAsync',
    async () => {
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
    async (forceRefresh: boolean) => {
        try {
            const res = await b2cClient.acquireTokenSilent({ scopes: config.auth.scopes, forceRefresh: forceRefresh });
            return res;
        } catch (error) {
            console.warn(error);
        }
        return null;
    }
);

export const { setAuthResult, setIosEphemeralSession } = authSlice.actions;

export default authSlice.reducer;
