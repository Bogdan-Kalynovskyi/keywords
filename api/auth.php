<?php
    include '../settings/settings.php';

    session_start();

        $link = mysql_connect($db_host, $db_user, $db_pass);
        if (!$link || !mysql_select_db($db_name)) {
            header("HTTP/1.0 500 Internal Server Error", true, 500);
            if ($error_reporting_level !== 0) {
                echo mysql_error();
            }
            die;
        }

    // compare Auth header with xsrf token from cookie-based session
//
//    if (isset($_SERVER['HTTP_AUTHORIZATION']) && isset($_SESSION['xsrfToken']) && $_SERVER['HTTP_AUTHORIZATION'] === $_SESSION['xsrfToken']) {
//        // then connect to db
//        $link = mysql_connect($db_host, $db_user, $db_pass);
//        if (!$link || !mysql_select_db($db_name)) {
//            header("HTTP/1.0 500 Internal Server Error", true, 500);
//            if ($error_reporting_level !== 0) {
//                echo mysql_error();
//            }
//            die;
//        }
//    }
//    else {
//        session_destroy();
//        header("HTTP/1.0 401 Unauthorized", true, 401);
//        echo 'You have logged out on other browser tab.\n\n The page will be reloaded.';
//        die;
//    }


header('Content-Type: application/json');



    function esc ($str) {
        return '"'.mysql_real_escape_string($str).'"';
    }