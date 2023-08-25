import { RootState } from "./store";

/// Selectors
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectNotes = (state: RootState) => state.nodesList.notes;
export const selectNotes = (state: RootState) => state.nodesList.notes;

export const selectNotesSource = (state: RootState) => state.nodesList.sourceType;

export const selectAccessToken = (state: RootState) => {
    if (!state.authReducer.AuthResult) {
        return ""
    }
    return state.authReducer.AuthResult.accessToken;
}

export const selectNotesMessage = (state: RootState, noteId: string) => {
    let messages = state.backgroundReducer.ChatMessages;
    let filteredMessages = messages.filter((message) => message.noteId === noteId);
    if (!filteredMessages || filteredMessages.length === 0) {
        return undefined;
    }
    return filteredMessages[0];
}
