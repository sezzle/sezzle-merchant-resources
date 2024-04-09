export const httpRequestWrapper = (method: string, url: string, body: any = null): Promise<string> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (body !== null) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error('Something went wrong, contact the Sezzle team!'));
            }
        };
        xhr.onerror = function () {
            reject(new Error('Something went wrong, contact the Sezzle team!'));
        };
        body === null ? xhr.send() : xhr.send(JSON.stringify(body));
    });
};

const getGeoIpBaseUrl = (): string => {
    return ((document as any).geoIpBaseUrl as string) || 'https://geoip.sezzle.com';
}

export { getGeoIpBaseUrl };


