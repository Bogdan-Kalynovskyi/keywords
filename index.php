<?php
    include 'settings/settings.php';
    session_start();
    $token = isset($_SESSION['xsrfToken']) ? $_SESSION['xsrfToken'] : '';
    $email = isset($_SESSION['email']) ? $_SESSION['email'] : '';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Phrase Research <?php echo $token ? ':: ...' : ':: Log In' ?></title>
    <link rel="stylesheet" type="text/css" href="stajl.css">
    <base href="/">
    <meta name="google-signin-client_id" content="<?php echo $google_api_id ?>">
    <?php if (!$token) { ?>
        <style>
            /* TODO check this when logged in too */
            /* TODO redo this into popup */
            /* TODO adblock or privacy block */
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
            a[target="_blank"] {
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
<script src="dist/assets/googleApi.js"></script>

<?php if ($token) {

    if (isset($_GET['code'])) {
        include 'settings/google_client.php';
        $client->authenticate($_GET['code']);
        $complex_token = $client->getAccessToken();
        $client->getAccessToken(["refreshToken"]);
        $refresh_token = $complex_token['refresh_token'];

        $link = mysql_connect($db_host, $db_user, $db_pass);
        if (!$link || !mysql_select_db($db_name)) {
            if ($error_reporting_level !== 0) {
                echo mysql_error();
            }
            echo 'could not connect to db';
            die;
        }

        mysql_query('REPLACE INTO `users` SET `offline_code` = "'.mysql_real_escape_string($refresh_token).'", `google_id` = "'.mysql_real_escape_string($_SESSION['userGoogleId']).'"');
        echo '<script>
            history.replaceState({}, "", location.origin);
        </script>';
    }
?>

<img src="dist/assets/img/ajax.gif" id="img-preloader" alt="" style="position: fixed; left: 50%; right: 50%; margin-left: -25px; margin-top: -25px;">
<script>
    var xsrfToken = '<?php echo $token ?>';
    var apiKey = '<?php echo $api_key ?>';
    var apiId = '<?php echo $google_api_id ?>';
    var userEmail = '<?php $email ?>';

    function showLoader() {
        document.getElementById("img-preloader").style.display = "block";
    }

    function hideLoader() {
        document.getElementById("img-preloader").style.display = "none";
    }
</script>

<app-root><div id="loading">Loading...</div></app-root>

<div id="chartNonBranded"></div>
<div id="chartBranded"></div>

<script async defer src="https://apis.google.com/js/api.js" onload="gapi.load('client:auth2', initClient);" onerror="adBlockError()"></script>

<?php } else { ?>

<script>
    test4Ie();

    // check for 3d party cookies are enabled
    window.addEventListener("message", function (evt) {
        if (evt.data === 'MM:3PCunsupported') {
            document.getElementById('test3dPartyCookies').style.display = 'block';
        }
    });
</script>
<script src="https://apis.google.com/js/platform.js" async defer onerror="adBlockError()"></script>

<div id="login-form">
    <div align="center" class="logincompany">PHRASE RESEACRH <span class="logincompanysmall">by Dejan</span></div>
    <div align="center">To get started sign in with your Google account</div>
        <br>
        <br>
        <div class="g-signin2" data-onsuccess="onGLogIn" data-onfailure="onGLoginFailure"></div>
        <br>
        <br>
    <div align="center">This is an open alpha. <br>
To access our legacy phrase potential calculator, <a href="http://legacy.phraseresearch.com/">click here.</a></div>
</div>

<div id="test3dPartyCookies"><b style="font-size: 1.3em;">Third party cookies are disabled in your browser</b><br><br>
Sign in using Google won't work unless you enable this feature in browser settings<br>
<a target=_blank href="https://www.google.com/search?q=how+do+I+enable+3rd+party+cookies+in+my+browser" style="font-size: 20px">Find solution in the internet (search using Google)</a>
</div>
<iframe src="//mindmup.github.io/3rdpartycookiecheck/start.html" style="display:none"></iframe>


<?php } ?>


<link href="dist/styles.bundle.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script src="https://www.gstatic.com/charts/loader.js"></script> <!-- async defer -->
<script src="dist/inline.bundle.js"></script>
<script src="dist/vendor.bundle.js"></script>
<script src="dist/main.bundle.js"></script>

</body>
</html>
