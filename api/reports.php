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
    echo $s;
    die;
}


function get () {
    $query = mysql_query('SELECT * FROM `reports` WHERE owner = '.esc($_SESSION['userGoogleId']).' ORDER BY created');
    $result = array();

    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        $num = array_shift($row);
        $result[$num] = $row;
    }

    if ($result) {
        echo json_encode($result);
    }
    else {
        echo '{}';
    }
}


function post () {
    $post = json_decode(file_get_contents('php://input'), true);
    $report = $post['report'];

    mysql_query('INSERT INTO `reports` (`csv`, `branded`, `name`, `owner`, `created`) VALUES ('.esc($report['csv']).','.esc($report['branded']).','.esc($report['name']).','.esc($_SESSION['userGoogleId']).',UNIX_TIMESTAMP())');

    echo mysql_insert_id();
}


function put () {
    $post = json_decode(file_get_contents('php://input'), true);
    $surveyId = intval($post['surveyId']);

    mysql_query('DELETE FROM tags WHERE survey_id = '.$surveyId);
    mysql_query('DELETE FROM terms WHERE survey_id = '.$surveyId);

    add($post['tags'], $surveyId);
    appendTerms($post['terms'], $surveyId);
    mysql_query('UPDATE surveys SET total = '.intval($post['total']).' WHERE id = '.$surveyId);
}


function delete () {
    $surveyId = intval($_GET['surveyId']);
    mysql_query('DELETE FROM surveys WHERE id = '.$surveyId);
    mysql_query('DELETE FROM tags WHERE survey_id = '.$surveyId);
    mysql_query('DELETE FROM terms WHERE survey_id = '.$surveyId);
    mysql_query('DELETE FROM answers WHERE survey_id = '.$surveyId);
}