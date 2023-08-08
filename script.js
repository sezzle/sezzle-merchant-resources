function sendEvent() {
    const body = [{
        event_name: "about-sezzle-onload",
        merchant_site: window.location.hostname,
    }];
    fetch('https://widget.sezzle.com/v1/event/log', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
};
sendEvent();