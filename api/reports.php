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
    $id = intval($_GET['id']);

    if ($id) {
        $query = mysql_query('SELECT * FROM `reports` WHERE id = '.$id.' AND owner = ' . esc($_SESSION['userGoogleId']));
        $result = mysql_fetch_array($query, MYSQL_ASSOC);

        if ($result) {
            echo json_encode($result);
        }
        else {
            header("HTTP/1.0 404 Not Found", true, 404);
        }
    }

    else {
        $query = mysql_query('SELECT id, name FROM `reports` WHERE owner = ' . esc($_SESSION['userGoogleId']) . ' ORDER BY created');
        $result = array();

        while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
            $num = array_shift($row);
            $result[$num] = $row;
        }

        if ($result) {
            echo json_encode($result);
        } else {
            echo '{}';
        }
    }
}


function post () {
    $post = json_decode(file_get_contents('php://input'), true);
    $report = $post['report'];

    mysql_query('INSERT INTO `reports` (`csv`, `branded`, `name`, `owner`, `created`) VALUES ('.esc($report['csv']).', '.esc($report['branded']).', '.esc($report['name']).', '.esc($_SESSION['userGoogleId']).', UNIX_TIMESTAMP())');

    echo mysql_insert_id();
}


function put () {
    $post = json_decode(file_get_contents('php://input'), true);
    $id = intval($_GET['id']);

    mysql_query('UPDATE `reports` SET `csv` = '.esc($post['csv']).', `branded` = '.esc($post['branded']).', `name` = '.esc($post['name']).',  WHERE id = '.$id.' AND owner = ' . esc($_SESSION['userGoogleId']));
}


function delete () {
    $id = intval($_GET['id']);
    mysql_query('DELETE FROM `reports` WHERE id = '.$id.' AND owner = ' . esc($_SESSION['userGoogleId']));
}