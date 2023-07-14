import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotesListStatus } from './actionType';
import { Note } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { MSALResult, MSALWebviewParams } from 'react-native-msal';
import { B2CClient, config } from '../tools/msal';
import { acquireTokenAsync, initAsync, loginAsync, logoutAsync } from './actions';

/// Init State
export interface AuthState {
    AuthResult: MSALResult | null;
    iosEphemeralSession: boolean;
    webviewParameters: MSALWebviewParams;
    status: NotesListStatus;
}

const initialState: AuthState = {
    AuthResult: null,
    iosEphemeralSession: false,
    webviewParameters: {
        ios_prefersEphemeralWebBrowserSession: false,
    },
    status: NotesListStatus.idle,
};

var b2cClient: B2CClient;

export const InitMsalB2cClient = () => {
    b2cClient = new B2CClient(config);
}

export const GetB2cClient = () => b2cClient;

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
            state.status = NotesListStatus.loading;
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = NotesListStatus.idle;
            state.AuthResult = action.payload;
        })
        .addCase(logoutAsync.pending, (state) => {
            state.status = NotesListStatus.loading;
        })
        .addCase(logoutAsync.fulfilled, (state) => {
            state.status = NotesListStatus.idle;
            state.AuthResult = null;
        })
        .addCase(initAsync.pending, (state) => {
            state.status = NotesListStatus.loading;
        })
        .addCase(initAsync.fulfilled, (state, action) => {
            state.status = NotesListStatus.idle;
            state.AuthResult = action.payload;
        })
        .addCase(acquireTokenAsync.pending, (state) => {
            state.status = NotesListStatus.loading;
        })
        .addCase(acquireTokenAsync.fulfilled, (state, action) => {
            state.status = NotesListStatus.idle;
            state.AuthResult = action.payload;
        });
    }
});

export const { setAuthResult, setIosEphemeralSession } = authSlice.actions;

export default authSlice.reducer;
