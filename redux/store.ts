import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import notesListReducer from './notesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    nodesList: notesListReducer,
    authReducer: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;