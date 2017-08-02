<?php

$link = mysql_connect($db_host, $db_user, $db_pass);
if (!$link || !mysql_select_db($db_name)) {
    header("HTTP/1.0 500 Internal Server Error", true, 500);
    if ($error_reporting_level !== 0) {
        echo mysql_error();
    }
    echo 'could not connect to db';
    die;
}


function esc ($str) {
    return '"'.mysql_real_escape_string($str).'"';
}