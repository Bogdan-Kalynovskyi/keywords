function auth2Login() {
    gapi.auth2.getAuthInstance().signIn();
}


function auth2Logout() {
    gapi.auth2.getAuthInstance().signOut();
}


function googleError(response) {
    alert('Google API Error: ' + response.result.error.message);
}


function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://searchconsole.googleapis.com/$discovery/rest?version=v1'],
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/webmasters.readonly'
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    },
    googleError);
}


function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        getSitesList();
    } else {
        //
    }
}


function getSitesList () {
    siteList = [];
    gapi.client.request({
        path: 'https://www.googleapis.com/webmasters/v3/sites',
        method: 'GET',
        params: {
            key: apiKey
        }
    }).then(function(response) {
        if (response.result.siteEntry) {
            response.result.siteEntry.forEach(function(site) {
                siteList.push(site.siteUrl);
            });
        }
        // todo react in Angular
    },
    googleError);
}


(function testCookies() {
    var iframe = document.createElement('IFRAME');
    window.addEventListener("message", function (evt) {
        if (evt.data === 'MM:3PCunsupported') {
            document.body.insertAdjacentHTML('beforeend', '<div id="test3dPartyCookies"><b style="font-size: 1.3em;">Third party cookies are disabled in your browser</b><br><br>Sign in using Google won\'t work unless you enable this feature in browser settings<br><a target=_blank href="https://www.google.com/search?q=how+do+I+enable+3rd+party+cookies+in+my+browser" style="font-size: 20px">Find solution in the internet (search using Google)</a></div>');
        }
    });

    iframe.src = '//mindmup.github.io/3rdpartycookiecheck/start.html';
})();