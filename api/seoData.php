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


function get () {
    $report_id = intval($_GET['id']);
    $start = intval($_GET['start']);
    $end = intval($_GET['end']);

    $query = mysql_query('SELECT `query`, SUM(`clicks`) as `clicks`, SUM(`impressions`) as `impressions`, ROUND(AVG(`ctr`)) as `ctr`, ROUND(AVG(`position`)) as `position` FROM `seoData` WHERE report_id='.$report_id.' AND date >= '.$start.' AND date <= '.$end.' GROUP by `query`');
    // todo security chac if the user has access to report id

    $result = array();
    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        $result[] = [$row['query'], $row['clicks'], $row['impressions'], $row['ctr'], $row['position']];
    }
    echo json_encode($result);
}

