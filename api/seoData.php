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

    $query = mysql_query('SELECT `query`, `clicks`, `impressions`, `ctr`, `position` FROM `seoData` WHERE report_id='.$report_id.' AND date >= '.$start.' AND date <= '.$end);
    // todo security chac if the user has access to report id

    $result = array();
    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        $query = $row['query'];
        $existing = $result[$query];
        if ($existing) {
            $existing[0] += $row['clicks'];
            $existing[1] += $row['impressions'];
            $existing[2] += $row['ctr'];
            $existing[3] += $row['position'];
        }
        else {
            $result[$query] = [$row['clicks'], $row['impressions'], $row['ctr'], $row['position']]; // php ver?
        }
    }
    echo json_encode($result);
}

