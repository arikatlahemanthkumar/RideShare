import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; // Ensure store is correctly imported
import App from "./App";
import AuthProvider from "./components/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
store.subscribe(() => {
    console.log("Updated Redux State:", store.getState());
  });
  
root.render(
  <Provider store={store}>
    <BrowserRouter>
    <AuthProvider>
        <App/> 
    </AuthProvider>
    </BrowserRouter>
  </Provider>
);
