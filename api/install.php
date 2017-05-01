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
  `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `keywords` TEXT NOT NULL,
  `siteUrl` TEXT NOT NULL,
  `owner` varchar(255) NOT NULL,
  `created` INT UNSIGNED NOT NULL,
  `yes_date` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `name` (`name`),
  INDEX `owner` (`owner`),
  INDEX `created` (`created`)
) DEFAULT CHARSET=utf8 ENGINE = InnoDB;
';
mysql_query($query);

$query = '
DROP TABLE IF EXISTS `seoData`;
';
mysql_query($query);
$query = '
CREATE TABLE IF NOT EXISTS `seodata` (
  `report_id` MEDIUMINT UNSIGNED NOT NULL,
  `date` INT NOT NULL,
  `query` varchar(255) NOT NULL,
  `page` varchar(255) NOT NULL,
  `clicks` MEDIUMINT UNSIGNED NOT NULL,
  `impressions` MEDIUMINT UNSIGNED NOT NULL,
  `ctr` MEDIUMINT UNSIGNED NOT NULL,
  `position` SMALLINT UNSIGNED NOT NULL,
  INDEX `report_id` (`report_id`),
  INDEX `date` (`date`)
) DEFAULT CHARSET=utf8 ENGINE = InnoDB;
';
mysql_query($query);

$query = '
DROP TABLE IF EXISTS `users`;
';
mysql_query($query);
$query = '
CREATE TABLE IF NOT EXISTS `users` (
  `google_id` varchar(255) NOT NULL,
  `offline_code` varchar(255) NOT NULL,
  `access_code` varchar(255) NOT NULL,
  PRIMARY KEY `google_id` (`google_id`),
  INDEX `offline_code` (`offline_code`),
  INDEX `access_code` (`access_code`)
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