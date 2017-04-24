<?php
include 'auth.php';


switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        get();
        break;

    case 'POST':
        post();
        break;

    case 'PUT':
        put();
        break;

    case 'DELETE':
        delete();
        break;
}

if ($s = mysql_error()) {
    header("HTTP/1.0 400 Bad Request", true, 400);
    if ($error_reporting_level !== 0) {
        echo $s;
    }
}


function put () {
    $post = json_decode(file_get_contents('php://input'), true);

    mysql_query('REPLACE INTO `users` SET `offline_code` = '.esc($post['code']).', google_id = ' . esc($_SESSION['userGoogleId']));
}
