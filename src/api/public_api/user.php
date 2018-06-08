<?php

$include_path = get_include_path();
include_once $include_path . '\includes\db_functions.php';
include_once $include_path . '\includes\request_functions.php';

$request_type = filter_input(INPUT_POST,'type',FILTER_SANITIZE_STRING);
$staff_id = filter_input(INPUT_POST,'staff',FILTER_SANITIZE_NUMBER_INT);
//$userid = filter_input(INPUT_POST,'userid',FILTER_SANITIZE_NUMBER_INT);
//$userval = base64_decode(filter_input(INPUT_POST,'userval',FILTER_SANITIZE_STRING));

switch ($request_type){
    case "getStaffDetails":
        getStaffDetails($staff_id);
        break;
    case "getAllStaff":
        getAllStaff();
        break;
    default:
        returnRequest(FALSE, null, "Unrecognised request type", $ex);
        break;
}

/* Get the details, including roles (tutor, teacher, HM, HOD...) for any staff member */
function getStaffDetails($staff_id) {
    /* Personal details */
    $staff_member = array();
    $details_query = "SELECT `ID`, `Initials`, `Forename`, `Surname`, `Email`, `Title` FROM `tstaff` WHERE `ID` = $staff_id";
    try {
        $details = db_select($details_query);
        if (count($details) > 0) {
            $staff_member = $details[0];
        } else {
            returnRequest(FALSE, null, "No staff members found with ID: $staff_id.");
        }
    } catch (Exception $ex) {
        returnRequest(FALSE, null, "Failed to get staff details", $ex);
    }

    /* Role details */
    /* Tutor Group */
    $tutor_query = "SELECT COUNT(*) `Count`  FROM `tstudents`
                        WHERE `TutorID` = $staff_id AND `Deleted` = 0;";
    /* Teaching Sets */
    $sets_query = "SELECT USJ.`SetID` FROM `tusersetjunction` USJ
                    JOIN `tsets` S ON USJ.`SetID` = S.`ID`
                    WHERE USJ.`StaffID` = $staff_id
                    AND USJ.`Deleted` = 0 AND S.`Deleted` = 0;";
    /* HM */
    $hm_query = "SELECT `HouseID` FROM `thms`
                    WHERE `StaffID` = $staff_id AND `Deleted` = 0";
    try {
        $tutor_count = db_select($tutor_query);
        $staff_member["TutorCount"] = count($tutor_count) > 0 ? $tutor_count[0]["Count"] : 0;
        $sets = db_select($sets_query);
        $staff_member["Sets"] = count($sets) > 0 ? convertResultsToArray($sets, "SetID") : null;
        $hm = db_select($hm_query);
        $staff_member["HM"] = count($hm) > 0 ? convertResultsToArray($hm, "HouseID") : null;
        $staff_member["HOD"] = null;
    } catch (Exception $ex) {
        returnRequest(FALSE, null, "There was an error getting the staff roles.", $ex);
    }
    returnRequest(TRUE, $staff_member);
}

/* Get all of the staff */
function getAllStaff() {
    $query = "SELECT * FROM `tstaff` WHERE `Deleted` = 0 ORDER BY `Surname`;";
    try {
        $staff = db_select($query);
    } catch (Exception $ex) {
        returnRequest(FALSE, null, "There was an error getting the staff.", $ex);
    }
    returnRequest(TRUE, $staff);
}

function convertResultsToArray($object, $key) {
    $return_array = [];
    for ($i = 0; $i < count($object); $i++) {
        array_push($return_array, $object[$i][$key]);
    }
    return $return_array;
}
