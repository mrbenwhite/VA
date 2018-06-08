<?php

function returnRequest($success, $response_array = null, $message = null, $ex = null){
    $response = array(
        "success" => $success,
        "response" => $response_array,
        "message" => $message
    );
    if (!is_null($ex)) $response["ex_message"] = $ex->getMessage();
    echo json_encode($response);
    exit();
}
