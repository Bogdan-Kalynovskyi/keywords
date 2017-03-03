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
        $query = mysql_query('SELECT `keywords`, `csv` FROM `reports` WHERE id = '.$id);// .' AND owner = ' . esc($_SESSION['userGoogleId']));
        $result = mysql_fetch_array($query, MYSQL_ASSOC);

        if ($result) {
            echo json_encode($result);
        }
        else {
            header("HTTP/1.0 404 Not Found", true, 404);
        }
    }

    else {
        $query = mysql_query('SELECT `id`, `name`, `keywords`, `created` FROM `reports`');//' WHERE owner = ' . esc($_SESSION['userGoogleId']) . ' ORDER BY created');

        $result = array();
        while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
            $result[] = $row;
        }
        echo json_encode($result);
    }
}


function post () {
    $post = json_decode(file_get_contents('php://input'), true);

    mysql_query('INSERT INTO `reports` (`csv`, `keywords`, `name`, `created`) VALUES ('.esc($post['csv']).', '.esc($post['keywords']).', '.esc($post['name']).', UNIX_TIMESTAMP())');

    echo mysql_insert_id();
}


function put () {
    $post = json_decode(file_get_contents('php://input'), true);
    $id = intval($_GET['id']);

    mysql_query('UPDATE `reports` SET `csv` = '.esc($post['csv']).', `keywords` = '.esc($post['keywords']).', `name` = '.esc($post['name']).',  WHERE id = '.$id);//.' AND owner = ' . esc($_SESSION['userGoogleId']));
}


function delete () {
    $id = intval($_GET['id']);
    mysql_query('DELETE FROM `reports` WHERE id = '.$id);//.' AND owner = ' . esc($_SESSION['userGoogleId']));
}