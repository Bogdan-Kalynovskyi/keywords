<?php

echo 'Your current version is '.PHP_VERSION.'<br>';
$php_min_version = '5.3.10';
if (version_compare(phpversion(), $php_min_version, '<')) {
    echo 'Minimal required PHP version is '.$php_min_version;
    echo 'Please update your PHP';
    die;
}


include '../settings/settings.php';

error_reporting(E_ALL ^ E_DEPRECATED);

mysql_connect($db_host, $db_user, $db_pass);
mysql_select_db($db_name);


$query = '
DROP TABLE IF EXISTS `reports`;
';
mysql_query($query);
$query = '
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `keywords` TEXT NOT NULL,
  `csv` LONGTEXT NOT NULL,
  `siteUrl` TEXT NOT NULL,
  `owner` varchar(255) NOT NULL,
  `created` int NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `name` (`name`),
  INDEX `owner` (`owner`),
  INDEX `created` (`created`)
) DEFAULT CHARSET=utf8 ENGINE = InnoDB;
';
mysql_query($query);

if (!mysql_errno()) {
?>

    <br>
    <br>
    <h3>Database tables successfully (re)created!</h3>
    <h4>You should now delete install.php form your server.</h4>
    <br>
    <br>
    And do check if <b>error_reporting</b> is set to <b>0</b> on your production environment...

<?php
}
else {
    echo mysql_error();
}