import {GEO_IP_BASE_URL} from "../constants";

interface IGeoIPResponse {
    country_iso_code?: string;
}

export async function getCountryCode(): Promise<string | void> {
    let response: string = await httpRequestWrapper('GET', `${GEO_IP_BASE_URL}/v1/geoip/ipdetails`);
    let parsedResponse: IGeoIPResponse = JSON.parse(response);

    if (parsedResponse.country_iso_code) {
        return parsedResponse.country_iso_code;
    } else {
        console.error('Cannot fetch the country code');
    }
}

const httpRequestWrapper = async (method: string, url: string, body: any = null): Promise<string> => {
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body !== null ? JSON.stringify(body) : null
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Something went wrong, contact the Sezzle team!');
    }
    return await response.text();
};

