import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import adminReducer from '../features/adminSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    /* [userApi.reducerPath]: userApi.reducer, */
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    /* userApi.middleware, */
  )
});