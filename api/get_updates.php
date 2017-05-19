<?php

define('NO_AUTH', true);

include 'auth.php';

include_once '../google_api/vendor/autoload.php';


getReportsList();

function getReportsList() {
    global $offline_code;
    $query = mysql_query('SELECT id, siteUrl, offline_code FROM reports INNER JOIN users ON reports.owner = users.google_id WHERE siteUrl<>\'\'');
    //$result = array();
    while ($row = mysql_fetch_array($query, MYSQL_ASSOC)) {
        getGoogleData($row['id'], $row['siteUrl'], $row['offline_code']);
        $offline_code = $row['offline_code'];
    }
}

function getGoogleData($id, $siteUrl, $offlineCode) {
    connect($offlineCode);
}


function connect($offline_code) {
    echo $offline_code;
    global $google_api_id, $client_secret, $api_key;

    $client = new Google_Client();
    $client->setApplicationName('Phraseresearch API');
    $client->setClientId($google_api_id);

    $client->setClientSecret($client_secret);

    $client->setRedirectUri('http://oldo.hol.es/api/get_updates.php');

    $client->setDeveloperKey($api_key);
    $client->setAccessType("offline");
    $client->setScopes('https://www.googleapis.com/auth/webmasters.readonly');
    $client->setApprovalPrompt('force');


    $guzzleClient = new \GuzzleHttp\Client(array( 'curl' => array( CURLOPT_SSL_VERIFYPEER => false, ), ));
    $client->setHttpClient($guzzleClient);

    echo '000'.$offline_code."\n";
        var_dump($client->authenticate($offline_code));
        echo '11'.$offline_code;
        $access_token = $client->getAccessToken();


echo $access_token;

//        $client->authenticate($offline_code);

//        $_SESSION['token'] = $client->getAccessToken();
//        $client->getAccessToken("refreshToken");



//        $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
//        header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
//    if (isset($_SESSION['token'])) {
//        $client->setAccessToken($_SESSION['token']);
//    }
//    if (isset($_REQUEST['logout'])) {
//        unset($_SESSION['token']);
//        $client->revokeToken();
//    }

    //$client->setDeveloperKey($api_key);  //smells

    //$client->setRedirectUri($redirect_uri);

    //$client->addScope("https://www.googleapis.com/auth/webmasters.readonly");
//    $guzzleClient = new \GuzzleHttp\Client(array( 'curl' => array( CURLOPT_SSL_VERIFYPEER => false, ), ));
//    $client->setHttpClient($guzzleClient);

//    echo $offline_code."\n";
//        $client->authenticate($offline_code);
//        echo $offline_code;
//        $access_token = $client->getAccessToken();


//    $service = new Google_Service_Webmasters($client);
//    $q = new Google_Service_Webmasters_SearchAnalyticsQueryRequest();
//
//        $q->setStartDate('2017-04-20');
//        $q->setEndDate('2017-04-21');
//        $q->setDimensions(['page']);
//        $q->setSearchType('web');
//        try {
//            $u = $service->searchanalytics->query('http://dejanseo.hr', $q);
//            echo '<table border=1>';
//            echo '<tr>
//          <th>#</th><th>Clicks</th><th>CTR</th><th>Imp</th><th>Page</th><th>Avg. pos</th>';
//            for ($i = 0; $i < count($u->rows); $i++) {
//                echo "<tr><td>$i</td>";
//                echo "<td>{$u->rows[$i]->clicks}</td>";
//                echo "<td>{$u->rows[$i]->ctr}</td>";
//                echo "<td>{$u->rows[$i]->impressions}</td>";
//                echo "<td>{$u->rows[$i]->keys[0]}</td>";
//                echo "<td>{$u->rows[$i]->position}</td>";
//
//                /* foreach ($u->rows[$i] as $k => $value) {
//                    //this loop does not work (?)
//                } */
//                echo "</tr>";
//            }
//            echo '</table>';
//        } catch(\Exception $e ) {
//            echo $e->getMessage();
//        }

}
//
//<div class="request">
//<?php
//    if (isset($authUrl)) {
//        echo "<a class='login' href='" . $authUrl . "'>Connect Me!</a>";
//    } else {
//        echo <<<END
//     <form id="url" method="GET" action="{$_SERVER['PHP_SELF']}">
//       <input name="url" class="url" type="text">
//       <input type="submit" value="Shorten">
//     </form>
//     <a class='logout' href='?logout'>Logout</a>
//END;
//    }
//
//<!--</div>-->
?>