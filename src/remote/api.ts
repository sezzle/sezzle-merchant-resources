export function sendEvent(body: any): void {
  fetch(`${process.env.REACT_APP_WIDGET_SERVER_URL}/v1/event/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send event");
      }
    })
    .catch((error) => {
      console.error("Error sending event:", error);
    });
}
