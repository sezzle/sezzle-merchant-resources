import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "./containers/ConfigProvider";
import {
    ABOUT_SEZZLE_ERROR_EVENT,
} from "./constants";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorInfo } from "react";
import { sendEvent } from "./remote/api";

const dispatchEvent = (
    eventType: string,
    description: string
) => {
    const body = [
        {
            event_name: eventType,
            description: description
        },
    ];
    // hooks are only accessible from inside a JSX element.
    // So passing data from here, instead of directly getting them during api call.
    // Some room for improvement.
    sendEvent(body);
};

const onFailure = (error: Error, info: ErrorInfo) => {
    console.log(`${error}: ${info.componentStack}`);
    dispatchEvent(ABOUT_SEZZLE_ERROR_EVENT, info.componentStack || "");
};

const root = ReactDOM.createRoot(
    document.getElementById("how-sezzle-works-container") as HTMLElement
);

root.render(
    <ConfigProvider>
        <ErrorBoundary
            fallback={
                <div>
                    Something went wrong.{" "}
                    <a
                        href="https://sezzle.com/how-it-works/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open Sezzle in new tab.
                    </a>
                </div>
            }
            onError={onFailure}
        >
            <App />
        </ErrorBoundary>
    </ConfigProvider>
);
