<?php

$include_path = get_include_path();
include_once $include_path . '\includes\db_functions.php';
include_once $include_path . '\includes\request_functions.php';

$query = "SELECT * FROM `tstaff` WHERE `ID` = 156";
try {
    $result = db_select($query);
} catch (Exception $ex) {
    returnRequest(FALSE, null, "Failed to get staff member", $ex);
}

returnRequest(TRUE, $result);
