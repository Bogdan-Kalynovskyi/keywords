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

    case 'PATCH':
        patch();
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


function report_not_found($id) {
    header("HTTP/1.0 404 Not Found", true, 404);
    echo 'Report with id '.$id.' not found';
}



function add_seoData ($seoData, $report_id) {
    $str = '';
    $comma = '';
    $time = time();

    foreach ($seoData as $row) {
        $d = isset($row[5]) ? intval($row[5]) : $time;
        $str .= $comma . '('.$report_id.','.esc($row[0]).','.intval($row[1]).','.intval($row[2]).','.intval($row[3]).','.intval($row[4]).','.$d.')';

        $comma = ',';
    }

    mysql_query('DELETE FROM `seoData` WHERE `report_id`='.$report_id);
    mysql_query('INSERT INTO `seoData` (`report_id`, `query`, `clicks`, `impressions`, `ctr`, `position`, `date`) VALUES '.$str);
}



function get () {
    $report_id = isset($_GET['id']) ? intval($_GET['id']) : false;

    if ($report_id) {
        $query = mysql_query('SELECT `name`, `keywords`, `siteUrl`, `yes_date`, IF(`owner`='.esc($_SESSION['userGoogleId']).', 1, 0) as `isOwner`  FROM `reports` WHERE id='.$report_id);
        $result = mysql_fetch_array($query, MYSQL_ASSOC);

        if ($result) {
            echo json_encode($result);
        }
        else {
            report_not_found($report_id);
        }
    }

    else {
        $query = mysql_query('SELECT `id`, `name`, `siteUrl`, `created` FROM `reports` WHERE owner='.esc($_SESSION['userGoogleId']).' ORDER BY created DESC');

        $result = array();
        while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
            $result[] = $row;
        }
        echo json_encode($result);
    }
}


function post () {
    $post = json_decode(file_get_contents('php://input'), true);

    mysql_query('INSERT INTO `reports` (`keywords`, `name`, `siteUrl`, `owner`, `created`, `yes_date`) VALUES ('.esc($post['keywords']).', '.esc($post['name']).', '.esc($post['siteUrl']).', '.esc($_SESSION['userGoogleId']).', UNIX_TIMESTAMP(), UNIX_TIMESTAMP())');

    $report_id = mysql_insert_id();
    add_seoData($post['seoData'], $report_id);

    echo $report_id;
}


function put () {
    $post = json_decode(file_get_contents('php://input'), true);
    $report_id = intval($_GET['id']);

    mysql_query('UPDATE `reports` SET `keywords`='.esc($post['keywords']).', `name`='.esc($post['name']).', `siteUrl`='.esc($post['siteUrl']).' WHERE id = '.$report_id.' AND owner = '.esc($_SESSION['userGoogleId']));

    if (!mysql_affected_rows()) {
        report_not_found($report_id);
    }
    else {
        if ($post['seoData']) {
            add_seoData($post['seoData'], $report_id);
        }
    }
}


function patch () {
    $report_id = intval($_GET['id']);

    mysql_query('UPDATE `reports` SET `yes_date`=UNIX_TIMESTAMP() WHERE id='.$report_id);

    if (!mysql_affected_rows()) {
        report_not_found($report_id);
    }
}


function delete () {
    $id = intval($_GET['id']);
    mysql_query('DELETE FROM `reports` WHERE id='.$id.' AND owner='.esc($_SESSION['userGoogleId']));

    if (!mysql_affected_rows()) {
        report_not_found($id);
    }
}