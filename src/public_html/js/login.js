$(document).ready(function(){
    if(checkLoggedInUser()) window.location = "index.html";
    requestStaff();
    var error_message = sessionStorage.getItem("error_message");
    (error_message !== null && error_message !== "") ? showErrorMessage(error_message) : hideErrorMessage();
});

function requestStaff() {
    var info_array = {
        type: "getAllStaff"
    };
    sendRequest("POST", info_array, "http://localhost/user.php", requestStaffSuccess, requestStaffError);
}

function requestStaffSuccess(json) {
    if (json["success"]) {
        setUpStaffSelect(json["response"]);
    } else {
        console.log(json["message"]);
        if (json["ex_message"] != undefined ) console.log(json["ex_message"]);
    }
}

function requestStaffError(json) {
    console.log(json.statusText);
}

function setUpStaffSelect(staff) {
    var select_html = "";
    for (var i = 0; i < staff.length; i++) {
        select_html += "<option value='" + staff[i]["ID"] + "'>" + staff[i]["Forename"] + " " + staff[i]["Surname"] + "</option>";
    }
    $("#login_box_select").html(select_html);
}

function clickLogin() {
    logInUser($("#login_box_select").val(), "index.html");
}

function showErrorMessage(message) {
    $("#login_box_detail").html("<p>" + message + "</p>");
    sessionStorage.setItem("error_message", "");
    $("#login_box_detail").css("display", "block");
}

function hideErrorMessage() {
    $("#login_box_detail").css("display", "none");
    $("#login_box_detail").html("");
}
