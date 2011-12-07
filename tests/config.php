<?php

if (!empty($_ENV['MYSQL_TEST_USER'])) {
    $dbDsn = 'mysqli://' . rawurlencode($_ENV['MYSQL_TEST_USER'])
        . ':' . rawurlencode($_ENV['MYSQL_TEST_PASSWD']);
    if (empty($_ENV['MYSQL_TEST_SOCKET'])) {
        $dbDsn .= '@' . $_ENV['MYSQL_TEST_HOST'];
        if (!empty($_ENV['MYSQL_TEST_PORT'])) {
            $dbDsn .= ':' . $_ENV['MYSQL_TEST_PORT'];
        }
    } else {
        $dbDsn .= '@unix(' . $_ENV['MYSQL_TEST_SOCKET'] . ')';
    }
    $dbDsn .= '/' . rawurlencode($_ENV['MYSQL_TEST_DB']);
} else {
    $dbDsn = 'mysql://USER:PSWD@HOST/DBNAME';
}
