// slice 들을 모아서 store에 저장, slice들을 모아서 관리해야징
import { configureStore } from "@reduxjs/toolkit";

// localStorage 저장 라이브러리
// import storage from "redux-persist/lib/storage";

import storageSession from "redux-persist/lib/storage/session";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";


import userSlice from "./userSlice";

const reducers = combineReducers({
  user: userSlice.reducer,
});

const persistConfig = {
  key: "root",
  // storage,
  storage: storageSession,
  whitelist: ["user"],
};
const presistedReducer = persistReducer(persistConfig, reducers);



const store = configureStore({
  // reducer: {
  //   user: userSlice.reducer,
  // },
  reducer: presistedReducer,
  // 임시로  middleware
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
  devTools: process.env.NODE_ENV !== "production",
});
export default store;