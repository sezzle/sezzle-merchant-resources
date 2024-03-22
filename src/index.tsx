import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "./containers/ConfigProvider";

const root = ReactDOM.createRoot(
  document.getElementById("how-sezzle-works-container") as HTMLElement
);
root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
