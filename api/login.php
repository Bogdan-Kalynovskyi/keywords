<?php
    include "../settings/settings.php";

    session_start();


    // ask Google for verification

    if (isset($_GET['authToken'])) {
        $_SESSION['authToken'] = $_GET['authToken'];
        $url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' . urlencode($_GET['authToken']);
        $json = @file_get_contents($url);
        $obj = @json_decode($json);
        if ($obj && isset($obj->aud) && $obj->aud === $google_api_id) {
            $_SESSION['userGoogleId'] = $obj->sub;
            $_SESSION['xsrfToken'] = base64_encode(openssl_random_pseudo_bytes(32));
            echo $_SESSION['xsrfToken'];
        }
        else {
            header("HTTP/1.0 401 Unauthorized", true, 401);
            echo 'Google authentication failed';
        }
    }


    // prevent api from recognising this client

    else {
        $post = json_decode(file_get_contents('php://input'), true);
        if (isset($post['logout']) && $post['logout'] === $_SESSION['xsrfToken']) {
            $response = file_get_contents('https://accounts.google.com/o/oauth2/revoke?token='.$_SESSION['authToken']);
            session_destroy();
            echo $response;
        }
    }
