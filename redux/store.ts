import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import notesListReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    nodesList: notesListReducer,
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