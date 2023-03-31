import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import isString from "lodash/isString";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./root.saga";
import rootReducer from "./root.reducer";

export let store;

export const makeStore = (context) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Add an extra parameter for applying middleware:
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const middlewareList = [...getDefaultMiddleware(), sagaMiddleware];

      return middlewareList;
    },
  });

  // // 3: Run your sagas on server
  store.sagaTask = sagaMiddleware.run(rootSaga);

  // 4: now return the store:
  return store;
};

export const wrapper = createWrapper(makeStore, {
  serializeState: (state) => {
    // Hack needed to avoid JSON-Serialization validation error from Next.js https://github.com/zeit/next.js/discussions/11209
    // >>> Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value all together.
    return JSON.stringify(state);
  },
  deserializeState: (state) => {
    return isString(state) ? JSON.parse(state) : state;
  },
});
