var session_user;
var teacher;

$(document).ready(function(){
    if(!checkLoggedInUser()) window.location = "login.html";
    //loadTeacherDetails();
    session_user = JSON.parse(sessionStorage.getItem("user"));
    teacher = session_user["UserObject"];
    initPage();
});
