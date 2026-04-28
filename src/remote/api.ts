import { IMerchantDetails } from "../interface";

export function sendEvent(body: any): void {
  fetch(`${import.meta.env.VITE_WIDGET_SERVER_URL}/v1/event/log`, {
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

export function GetMerchantDetails(
  merchant_uuid: string
): Promise<IMerchantDetails | null> {
  return fetch(
    `${import.meta.env.VITE_WIDGET_SERVER_URL}/v1/merchants/${merchant_uuid}/how-sezzle-works`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get merchant details");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error getting merchant details:", error);
      return null;
    });
}
