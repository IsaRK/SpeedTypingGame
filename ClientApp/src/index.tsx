import "bootstrap/dist/css/bootstrap.css";

import * as React from "react";
import registerServiceWorker from "./registerServiceWorker";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "./redux/reducer";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

const logger = createLogger({ collapsed: true });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = createStore(rootReducer, applyMiddleware(logger, thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
