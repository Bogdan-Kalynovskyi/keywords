<?php
    include "../settings/settings.php";

    session_start();


    // ask Google for verification

    if (isset($_GET['authToken'])) {
        $url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' . urlencode($_GET['authToken']);
        $json = @file_get_contents($url);
        $obj = @json_decode($json);
        if ($obj && isset($obj->aud) && $obj->aud === $google_api_id) {
            $_SESSION['userGoogleId'] = $obj->sub;
            $_SESSION['email'] = $obj->email;
            $_SESSION['xsrfToken'] = base64_encode(openssl_random_pseudo_bytes(32));

            $link = mysql_connect($db_host, $db_user, $db_pass);
            if (!$link || !mysql_select_db($db_name)) {
                header("HTTP/1.0 500 Internal Server Error", true, 500);
                if ($error_reporting_level !== 0) {
                    echo mysql_error();
                }
                die;
            }

            $result = mysql_query('SELECT `offline_code` FROM `users` WHERE `google_id` = "' . mysql_real_escape_string($_SESSION['userGoogleId'] . '"'));
            if (!$result) {
                include '../settings/google_client.php';
                echo $client->createAuthUrl();
            }
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
//            session_destroy();
        }
    }
