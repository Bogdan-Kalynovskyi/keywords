<?php
    include 'settings/settings.php';
    session_start();
    $token = isset($_SESSION['xsrfToken']) && $_SESSION['xsrfToken'];
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title><?php echo $token ? '+' : '-' ?></title>
    <meta name="google-signin-client_id" content="<?php echo $google_api_id ?>">
    <style>
        #loading {
            position: absolute;
            font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
            color: #bbb;
            font-size: 1.25rem;
            font-weight: 500;
            width: 100%;
            top: calc(50% - 22px);
            text-align: center;
        }
    </style>
    <?php if (!$token) { ?>
    <style>
    #login-form {
        position: absolute;
        width: 480px;
        left: 50%;
        top: 50%;
        margin-left: -240px;
        margin-top: -100px;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        font-size: 1.25rem;
        font-weight: 400;
    }
    .abcRioButton {
        box-shadow: 3px 3px 10px rgba(0,0,0,.4) !important;
    }
    .abcRioButtonContents {
        font-size: 14px !important;
        margin-left: 0 !important;
    }
    #test3dPartyCookies {
        position: absolute;
        width: 436px;
        left: 50%;
        margin-left: -220px;
        top: 24px;
        z-index: 1000;
        box-shadow: 0 0 40px darkred;
        border-radius: 4px;
        border: 2px dotted darkred;
        padding: 16px;
        display: none;
        background: #ff9;
    }
    a[target="_blank"] {
        display: block;
        padding-top: 9px;
    }
    a[target="_blank"]:after {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=");
        margin: 0 0 0 7px;
    }
    #logged-in {
        display: none;
    }
    </style>
    <?php } ?>
</head>

<body>
<script src="https://apis.google.com/js/platform.js" async defer onload="onPlatformLoad()"></script>


<script>
    (function() {
        var ua = navigator.userAgent,
            IEVersion = ua.indexOf("MSIE ");

        if (IEVersion !== -1) {
            IEVersion = parseInt(ua.split('MSIE ')[1]);
        } else if (ua.match(/trident.*rv\:11\./)) {
            IEVersion = 11;
        }
        if (IEVersion !== -1) {
            document.documentElement.className = 'ie' + IEVersion;
            if (IEVersion < 10) {
                alert('Sorry, but we are not supporting Internet Explorer 9 and below.');
            }
        }
    })();


    function googleLogIn (g) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'api/login.php?authToken=' + encodeURIComponent(g.getAuthResponse().id_token));
        xhr.onload = function() {
            if (xhr.status === 200) {
                window.xsrfToken = xhr.responseText;
                if (window.app) {       // flag that app file has been loaded
                    showApp();
                }
            }
            else {
                alert('Login error: ' + xhr.responseText); // ?
            }
        };
        xhr.send();
    }


    function onPlatformLoad() {
<!--        --><?php //if ($token) { ?>
//        if (window.app) {
//            gapi.load('auth2', function () {
//                gapi.auth2.init({
//                    client_id: '<?php //echo $google_api_id ?>//'
//                });
//            });
//        }
//        <?php //} ?>
        // https://accounts.google.com/o/oauth2/revoke?token="+ACCESS_TOKEN
    }


    <?php if ($token) { ?>
    window.xsrfToken = '<?php echo $_SESSION['xsrfToken'] ?>';
    <?php } else { ?>
    // check for 3d party cookies are enabled
    window.addEventListener("message", function (evt) {
        if (evt.data === 'MM:3PCunsupported') {
            document.getElementById('test3dPartyCookies').style.display = 'block';
        }
    });
    <?php } ?>
</script>


<?php if (!$token) { ?>
    <div id="logged-out">
        <div id="login-form">
            <div style="float:left; width:180px">Company Logo</div>
            <div style="float:left; width:300px">
                Sign in using Google account
                <br>
                <br>
                <div class="g-signin2" data-onsuccess="googleLogIn"></div>
            </div>
        </div>
        <div id="test3dPartyCookies"><b style="font-size: 1.3em;">Third party cookies are disabled in your browser</b><br><br>
            Sign in using Google won't work unless you enable this feature in browser settings<br>
            <a target=_blank href="https://www.google.com/search?q=how+do+I+enable+3rd+party+cookies+in+my+browser" style="font-size: 20px">Find solution in the internet (using Google Search)</a>
        </div>
        <iframe src="//mindmup.github.io/3rdpartycookiecheck/start.html" style="display:none"></iframe>
    </div>
<?php } ?>


<div id="logged-in">
    <div id="loading">Loading...</div>
</div>

</body>
</html>