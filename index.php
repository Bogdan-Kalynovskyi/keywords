<?php
    include 'settings/settings.php';
    session_start();
    $token = isset($_SESSION['xsrfToken']) && $_SESSION['xsrfToken'];
    $has_offline_access = isset($_SESSION['offline']);
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title><?php echo $token ? '::' : ':: Log In' ?></title>
    <base href="/">
    <meta name="google-signin-client_id" content="<?php echo $google_api_id ?>">
    <style>
        body {
            margin: 0;
        }
        #loading {
            position: absolute;
            font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
            color: #bfbfbf;
            font-size: 1.75rem;
            letter-spacing: 0.7px;
            font-weight: 500;
            width: 100%;
            top: calc(50% - 28px);
            text-align: center;
        }
    </style>
    <?php if (!$token) { ?>
    <style>
    #login-form {
        position: absolute;
        width: 460px;
        left: calc(50% - 230px);
        top: calc(50% - 40px);
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        font-size: 1.3rem;
        font-weight: 400;
    }
    /* TODO this can change, so check button design from time to time */
    .abcRioButton {
        box-shadow: 3px 3px 10px rgba(0,0,0,.4) !important;
    }
    .abcRioButtonContents {
        font-size: 14px !important;
        margin-left: 0 !important;
    }
    /* TODO check this regularly too :) */
    /* TODO check this when logged in too */
    /* TODO redo this into popup */
    /* TODO adblock or google block */
    #test3dPartyCookies {
        position: absolute;
        width: 436px;
        left: calc(50% - 220px);
        top: 24px;
        z-index: 1000;
        box-shadow: 0 0 50px darkred, 0 0 0 30px white; /* todo modal*/
        border-radius: 4px;
        border: 2px dotted darkred;
        padding: 16px;
        display: none;
        background: #ff9;
    }
    /* inside popup? */ a[target="_blank"] {
        display: block;
        letter-spacing: 0.2px;
        margin-top: 10px;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=") right center no-repeat;
        text-decoration: none;
    }
    </style>
    <?php } ?>
</head>

<body>
    <script src="googleApi.js"></script>

<?php if ($token) { ?>

    <script>
        var xsrfToken = '<?php echo $_SESSION['xsrfToken'] ?>';
        var hasOfflineAccess = '<?php echo $has_offline_access ?>';
        var apiKey = '<?php echo $api_key ?>';
        var clientId = '<?php echo $google_api_id ?>';
    </script>

    <app-root><div id="loading">Loading...</div></app-root>

    <div id="chartNonBranded"></div>
    <div id="chartBranded"></div>

    <script async defer src="https://apis.google.com/js/api.js" onload="gapi.load('client:auth2', initClient);" onerror="adBlockError()"></script>

<?php } else { ?>

    <script>
        (function test4Ie() {
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
                    alert('Sorry, we are not supporting Internet Explorer 9 and lower.');
                }
            }
        })();


        function googleLogIn(response) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'api/login.php?authToken=' + encodeURIComponent(response.getAuthResponse().id_token));
            xhr.onload = function() {
                if (xhr.status === 200) {
                    location.reload();
                }
                else {
                    alert('Could not log into ' + location.hostname + '. ' + xhr.responseText); // ?
                }
            };
            xhr.send();
        }
    </script>
    <script src="https://apis.google.com/js/platform.js" async defer onerror="adBlockError()"></script>

    <div id="login-form">
        <div style="float:left; width:160px">Company Logo</div>
        <div style="float:left; width:300px">
            Sign in using Google account
            <br>
            <br>
            <div class="g-signin2" data-onsuccess="googleLogIn" data-onfailure="alert"></div>
        </div>
    </div>

<?php } ?>


    <link href="dist/styles.bundle.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="https://www.gstatic.com/charts/loader.js"></script> <!-- async defer -->
    <script src="dist/inline.bundle.js"></script>
    <script src="dist/vendor.bundle.js"></script>
    <script src="dist/main.bundle.js"></script>
</body>
</html>