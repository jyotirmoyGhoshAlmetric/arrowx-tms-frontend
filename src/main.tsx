import { createRoot } from "react-dom/client";
import "./assets/css/app.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "react-toastify/dist/ReactToastify.css";
import "@radix-ui/themes/styles.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);