import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import adminReducer from "./admin/adminSlice";
import { persistReducer, persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import themeReducer from "./theme/themeSlice"
import passwordReducer from "./passwordExist/passwordExistSlice";

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  theme: themeReducer,


  
});

const persisConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persisConfig, rootReducer);



export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({serializableCheck: false})
  }
});

export const persistor = persistStore(store)
