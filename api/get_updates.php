<?php

include __DIR__.'/../settings/settings.php';

$link = mysql_connect($db_host, $db_user, $db_pass);
if (!$link || !mysql_select_db($db_name)) {
    header("HTTP/1.0 500 Internal Server Error", true, 500);
    if ($error_reporting_level !== 0) {
        echo mysql_error();
    }
    die;
}

function esc ($str) {
    return '"'.mysql_real_escape_string($str).'"';
}



require_once __DIR__.'/../Gplus/vendor/autoload.php';


error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', 1);


function print_result($id, $result) {
    for ($i = 0; $i < count($result->rows); $i++) {
        $query = $result->rows[$i]->keys[0];
        $page = $result->rows[$i]->keys[1];
        $date = $result->rows[$i]->keys[2];
        $clicks = $result->rows[$i]->clicks;
        $impressions = $result->rows[$i]->impressions;
        $position = $result->rows[$i]->position;
        $ctr = $result->rows[$i]->ctr;
        echo "$id\t$date\t$query\t$page\t$clicks\t$impressions\t$position\t$ctr\n";
    }
    echo "\n\n";
}


function save_to_db($report_id, $date_to_save, $seoData) {
    $str = '';
    $comma = '';

    foreach ($seoData as $row) {
        $str .= $comma . '('.$report_id.','.esc($row->keys[0]).','.intval($row->clicks).','.intval($row->impressions).','.intval(floatval($row->ctr) * 100000).','.intval(floatval($row->position) * 10).','.intval($date_to_save).', '.esc($row->keys[1]).')';

        $comma = ',';
    }

    //echo 'INSERT INTO `seodata` (`report_id`, `query`, `clicks`, `impressions`, `ctr`, `position`, `date`, `page`) VALUES '.$str."<br><br>";
    mysql_query( 'INSERT INTO `seodata` (`report_id`, `query`, `clicks`, `impressions`, `ctr`, `position`, `date`, `page`) VALUES '.$str);

}


function getGoogleData($id, $siteUrl, $accessToken, $refreshToken) {
    $client = new Google_Client();
    $client->setApplicationName('Phraseresearch API');
    $client->setClientId('39575750767-4d3ieqoemj7kc43hi76qrp9ft2qnqo3e.apps.googleusercontent.com');
    $client->setClientSecret('H-4n_ZGNKJphWXdRW3OGTPrF');
    $client->setDeveloperKey('AIzaSyD5_k-oAl-WZNaDGey4k3U9_noryurZjKo');
    $client->setRedirectUri('http://www.phraseresearch.com/api/1.php');
    $client->setScopes(['https://www.googleapis.com/auth/webmasters.readonly']);
    $client->setAccessType('offline');
    $client->setApprovalPrompt('force');

    $service = new Google_Service_Webmasters($client);

    $client->setAccessToken($accessToken);

    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken($refreshToken);
        $tokens = $client->getAccessToken();
        $client->setAccessToken($tokens);
    }

    $request = new Google_Service_Webmasters_SearchAnalyticsQueryRequest();

    date_default_timezone_set('UTC');
    $date_to_save = strtotime("midnight -3 days");
    $date = date("Y-m-d", $date_to_save);

    $request->setStartDate($date);
    $request->setEndDate($date);
    $request->setRowLimit(5000);
    $request->setDimensions(['query', 'page', 'date']);
    $request->setSearchType('web');
    try {
        $result = $service->searchanalytics->query($siteUrl, $request);
        //print_result($id, $result);
        save_to_db($id, $date_to_save, $result);
        //print_r($result);
        echo date("Y-m-d H:i:s", time())."----Success----Report id: ".$id."----".count($result->rows)." rows added--\n";

    } catch(\Exception $e ) {
        echo date("Y-m-d H:i:s", time())."----Failed----Report id: ".$id."---".$e->getMessage()."--\n";
    }

}


function getReportsList() {
    $query = mysql_query('SELECT id, siteUrl, access_token, offline_code FROM reports INNER JOIN users ON reports.owner = users.google_id WHERE siteUrl<>\'\'');
    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        getGoogleData($row['id'], $row['siteUrl'], $row['access_token'], $row['offline_code']);
    }
}

getReportsList();

?>