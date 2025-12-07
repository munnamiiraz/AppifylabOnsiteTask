import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { createPostApi } from './api/createPostApi';
import authReducer from './slices/authSlice';
import postCreationReducer from './slices/postCreationSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [createPostApi.reducerPath]: createPostApi.reducer,
    auth: authReducer,
    postCreation: postCreationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, createPostApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
