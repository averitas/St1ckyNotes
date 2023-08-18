import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotesListStatus } from './actionType';

/// Init State
export interface AuthState {
    ErrorMessages: string[];
}

const initialState: AuthState = {
    ErrorMessages: [],
};

export const backgroundSlice = createSlice({
    name: 'background',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addErrorMessage: (state, action: PayloadAction<string>) => {
            state.ErrorMessages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
      
    }
});

export const { addErrorMessage } = backgroundSlice.actions;

export default backgroundSlice.reducer;
