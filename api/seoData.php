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

    if (isset($_GET['start'])) {
        $start = intval($_GET['start']);
        $end = intval($_GET['end']);

        //todo code dupe
        $query = mysql_query('SELECT `query`, `page`, ROUND(SUM(`clicks`)/3) as `clicks`, ROUND(SUM(`impressions`)/3) as `impressions`, ROUND(AVG(`ctr`)) as `ctr`, ROUND(AVG(`position`)) as `position` FROM `seodata` WHERE report_id=' . $report_id . ' AND date >= ' . $start . ' AND date <= ' . $end . ' GROUP by `query`, `page`');
        // todo security chac if the user has access to report id
    }
    else {
        //todo code dupe
        $query = mysql_query('SELECT `query`, `page`, SUM(`clicks`) as `clicks`, SUM(`impressions`) as `impressions`, ROUND(AVG(`ctr`)) as `ctr`, ROUND(AVG(`position`)) as `position` FROM `seodata` WHERE report_id='.$report_id.' GROUP by `query`, `page`');
        // todo security chac if the user has access to report id
    }

    $result = array();
    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        $result[] = array($row['query'], $row['page'], $row['clicks'], $row['impressions'], $row['ctr'], $row['position']);
    }
    echo json_encode($result);
}

