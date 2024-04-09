import {getGeoIpBaseUrl, httpRequestWrapper} from './utils';

interface ICountryResponse {
    country_iso_code?: string;
}

export class getCountryCode {
    private _configInst = {
        apiEndpoints: {
            countryFromIPRequestURL: `${getGeoIpBaseUrl()}/v1/geoip/ipdetails`,
        },
    };

    public async _getCountryCodeFromIP(): Promise<string | void> {
        let response: string = await httpRequestWrapper('GET', this._configInst.apiEndpoints.countryFromIPRequestURL);
        let parsedResponse: ICountryResponse = JSON.parse(response);

        if (parsedResponse.country_iso_code) {
            return parsedResponse.country_iso_code;
        } else {
            console.error('Cannot fetch the country code');
        }
    }
}
