<?php

include 'auth.php';
require_once '../google_api/vendor/autoload.php';



getReportsList();

getGoogleData();


if ($s = mysql_error()) {
    header("HTTP/1.0 400 Bad Request", true, 400);
    if ($error_reporting_level !== 0) {
        echo $s;
    }
}

function getReportsList() {
    $query = mysql_query('SELECT `id`, `siteUrl`  FROM `reports`');
    echo $query;
    $result = array();
    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        $result[] = $row;
    }
    echo json_encode($result);
}





function getGoogleData () {

}