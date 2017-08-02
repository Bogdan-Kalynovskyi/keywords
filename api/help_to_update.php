<?php
$time = time();
echo "Current server date and time: ".date("Y-m-d H:i:s", $time)."<br>";
echo "Current server time zone: ".date_default_timezone_get()."<br><br>";
date_default_timezone_set('UTC');
echo "After UTC time zone set.<br> Current server date and time: ".date("Y-m-d H:i:s", $time)."<br>";
echo "Current server time zone: ".date_default_timezone_get()."<br>";
$date_to_save = strtotime("midnight -3 days");
$date = date("Y-m-d H:i:s", $date_to_save);
echo "Updates date and time: ".$date;
?>