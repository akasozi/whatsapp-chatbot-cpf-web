import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import conversationsReducer from './slices/conversationsSlice';
import issuesReducer from './slices/issuesSlice';
import applicationsReducer from './slices/applicationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationsReducer,
    issues: issuesReducer,
    applications: applicationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: true
});

export default store;