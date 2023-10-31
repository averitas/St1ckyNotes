import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotesListStatus } from './actionType';
import { ChatMessage } from '../types/general';
import { ChatAppClient } from '../tools/clients/chatAppClient';
import { sendChatAsync } from './actions';

var chatAppClient: ChatAppClient;

export const SetChatAppClient = (client: ChatAppClient) => {
    chatAppClient = client;
}

export const GetChatAppClient = () => chatAppClient;

/// Init State
export interface ClientState {
    ErrorMessages: string[];
    ChatMessages: ChatMessage[];
    status: NotesListStatus;
}

const initialState: ClientState = {
    ErrorMessages: [],
    ChatMessages: [],
    status: NotesListStatus.idle,
};

export const backgroundSlice = createSlice({
    name: 'background',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addErrorMessage: (state, action: PayloadAction<string>) => {
            state.ErrorMessages.push(action.payload);
        },
        pushChatMessage: (state, action: PayloadAction<ChatMessage>) => {
            let newMessages = []
            let added = false;
            state.ChatMessages.forEach(element => {
                if (element.noteId !== action.payload.noteId) {
                    newMessages.push(element);
                    added = true;
                } else {
                    newMessages.push(action.payload);
                }
            });
            if (!added) {
                newMessages.push(action.payload);
            }
            console.log('Insert ChatMessage of id: ' + action.payload.noteId);

            state.ChatMessages = newMessages;
        }
    },
    extraReducers: (builder) => {
      builder
      .addCase(
        sendChatAsync.pending, (state, action) => {
            state.status = NotesListStatus.loading;
        }
      )
      .addCase(
        sendChatAsync.fulfilled, (state, action) => {
            state.status = NotesListStatus.idle;
            pushChatMessage(action.payload);
        }
      )
    }
});

export const { addErrorMessage, pushChatMessage } = backgroundSlice.actions;

export default backgroundSlice.reducer;
