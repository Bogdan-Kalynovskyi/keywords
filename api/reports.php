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
    $id = isset($_GET['id']) ? intval($_GET['id']) : false;

    if ($id) {
        $query = mysql_query('SELECT `name`, `keywords`, `siteUrl`, `csv`, IF(`owner` = ' . esc($_SESSION['userGoogleId']) . ', 1, 0) as `isOwner`  FROM `reports` WHERE id = '.$id);
        $result = mysql_fetch_array($query, MYSQL_ASSOC);

        if ($result) {
            echo json_encode($result);
        }
        else {
            header("HTTP/1.0 404 Not Found", true, 404);
        }
    }

    else {
        $query = mysql_query('SELECT `id`, `name`, `siteUrl`, `created` FROM `reports` WHERE owner = ' . esc($_SESSION['userGoogleId']) . ' ORDER BY created DESC');

        $result = array();
        while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
            $result[] = $row;
        }
        echo json_encode($result);
    }
}


function post () {
    $post = json_decode(file_get_contents('php://input'), true);

    mysql_query('INSERT INTO `reports` (`csv`, `keywords`, `name`, `siteUrl`, `owner`, `created`) VALUES ('.esc($post['csv']).', '.esc($post['keywords']).', '.esc($post['name']).', '.esc($post['siteUrl']).', '.esc($_SESSION['userGoogleId']).', UNIX_TIMESTAMP())');

    echo mysql_insert_id();
}


function put () {
    $post = json_decode(file_get_contents('php://input'), true);
    $id = intval($_GET['id']);

    if ($post['csv'] != '') {
        mysql_query('UPDATE `reports` SET `csv` = '.esc($post['csv']).', `keywords` = '.esc($post['keywords']).', `name` = '.esc($post['name']).', `siteUrl` = '.esc($post['siteUrl']).'  WHERE id = '.$id.' AND owner = ' . esc($_SESSION['userGoogleId']));
    } else {
        mysql_query('UPDATE `reports` SET `keywords` = '.esc($post['keywords']).', `name` = '.esc($post['name']).', `siteUrl` = '.esc($post['siteUrl']).'  WHERE id = '.$id.' AND owner = ' . esc($_SESSION['userGoogleId']));
    }
}


function delete () {
    $id = intval($_GET['id']);
    mysql_query('DELETE FROM `reports` WHERE id = '.$id.' AND owner = ' . esc($_SESSION['userGoogleId']));
}