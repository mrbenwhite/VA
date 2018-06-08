var mobile_screen = false;
var return_url;
var sidebar_count = 0;

$(document).ready(function(){
    //document.documentElement.style.setProperty('--header-height', "100px");
})

/* Display functions */

$(window).resize(function() {
    if($(window).width() <= 600) {
        if (!mobile_screen) {
            hideAllOnChange();
        }
        mobile_screen = true;
    } else {
        if (mobile_screen) {
            hideAllOnChange();
            $("#sidebar").css("display", "block");
            $("#dropdown_content").css("display", "block");
        }
        mobile_screen = false;
    }
});

function toggleDropdown() {
    if($(window).width() <= 600) {
        if($("#sidebar").css("display") === "block") {
            hideSidebar();
        }
        if($("#dropdown_content").css("display") === "none") {
            showDropdown();
        } else {
            hideDropdown();
        }
    }
}

function toggleSidebar() {
    if($(window).width() <= 600) {
        if($("#dropdown_content").css("display") === "block") {
            hideDropdown();
        }
        if($("#sidebar").css("display") === "none") {
            showSidebar();
        } else {
            hideSidebar();
        }
    }
}

function closeMenus() {
    if($(window).width() <= 600) {
        if($("#dropdown_content").css("display") === "block") {
            hideDropdown();
        }
        if($("#sidebar").css("display") === "block") {
            hideSidebar();
        }
    }
}

function hideAllOnChange() {
    $(".main_content").removeClass("dropdown_show");
    $(".header").removeClass("dropdown_show");
    $(".main_content").removeClass("sidebar_show");
    $(".header").removeClass("sidebar_show");
    $("#dropdown_content").css("display", "none");
    $("#sidebar").css("display", "none");
}

function hideDropdown() {
    $("#dropdown_content").slideUp();
    $(".main_content").removeClass("dropdown_show");
    $(".header").removeClass("dropdown_show");
}

function showDropdown() {
    $("#dropdown_content").slideDown();
    $(".main_content").addClass("dropdown_show");
    $(".header").addClass("dropdown_show");
}

function hideSidebar() {
    $("#sidebar").slideUp();
    $(".main_content").removeClass("sidebar_show");
    $(".header").removeClass("sidebar_show");
}

function showSidebar() {
    $("#sidebar").slideDown();
    $(".main_content").addClass("sidebar_show");
    $(".header").addClass("sidebar_show");
}

function getColourForValue(val, max, mid, min, col_1, col_2, col_3) {
    var r, g, b;
    if (val > mid) {
        var perc = Math.min((val - mid)/(max - mid), 1);
        r = col_2[0] + (col_1[0] - col_2[0]) * perc;
        g = col_2[1] + (col_1[1] - col_2[1]) * perc;
        b = col_2[2] + (col_1[2] - col_2[2]) * perc;
    } else {
        var perc = Math.min((mid - val)/(mid - min), 1);
        r = col_2[0] + (col_3[0] - col_2[0]) * perc;
        g = col_2[1] + (col_3[1] - col_2[1]) * perc;
        b = col_2[2] + (col_3[2] - col_2[2]) * perc;
    }
    return [parseInt(r), parseInt(g), parseInt(b)];
}

/* Functionality functions */
function orderArrayBy(array, key, desc) {
    array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (typeof x == "string" && typeof y == "string") {
            x = (""+x).toLowerCase();
            y = (""+y).toLowerCase();
        } else if (typeof x == "string" || typeof y == "string") {
            if (typeof x == "string") x = -1000;
            if (typeof y == "string") y = -1000;
        }
        return desc ? ((x < y) ? 1 : ((x > y) ? -1 : 0)) : ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    return array;
}

function orderArrayByDate(array, key, date_format, desc) {
    array.sort(function(a, b) {
        return desc ? moment(b[key], date_format).valueOf() - moment(a[key], date_format).valueOf() : moment(a[key], date_format).valueOf() - moment(b[key], date_format).valueOf();
    });
    return array;
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

/* Request functions */
function sendRequest(type, data, url, successFunction, errorFunction) {
    $.ajax({
        type: type,
        data: data,
        url: url,
        dataType: "json",
        success: successFunction,
        error: errorFunction
    });
}

/* Login function */

function logInUser(user_id, url) {
    var user_array = {
        "UserID": user_id,
        "ActiveTime": Math.round((new Date()).getTime() / 1000)
    }
    return_url = url;
    sessionStorage.setItem("user", JSON.stringify(user_array));
    loadTeacherDetails(user_id, true);
}

function checkLoggedInUser() {
    try {
        var session_user = JSON.parse(sessionStorage.getItem("user"));
        if (session_user.hasOwnProperty("UserID") && session_user.hasOwnProperty("ActiveTime")) {
            if (parseInt(session_user["ActiveTime"]) + 3600 > Math.round((new Date()).getTime() / 1000)) {
                session_user["ActiveTime"] = Math.round((new Date()).getTime() / 1000);
                sessionStorage.setItem("user", JSON.stringify(session_user));
                loadTeacherDetails(session_user["UserID"], false);
                return true;
            } else {
                sessionStorage.setItem("user", "");
                return false;
            }
        } else {
            sessionStorage.setItem("user", "");
            return false;
        }
    } catch (e) {
        sessionStorage.setItem("user", "");
        return false;
    }
}

/* Request teacher details */
function loadTeacherDetails(teacher, load) {
    var info_array = {type: "getStaffDetails", staff: teacher};
    if (load) {
        sendRequest("POST", info_array, "http://localhost/user.php", loadTeacherSuccess, requestTeacherError);
    } else {
        sendRequest("POST", info_array, "http://localhost/user.php", updateTeacherSuccess, requestTeacherError);
    }
}

function updateTeacherSuccess(json) {
    updateTeacherObject(json);
}

function loadTeacherSuccess(json) {
    if (updateTeacherObject(json)) {
        window.location = return_url;
    } else {
        sessionStorage.setItem("error_message", "Error logging in.");
        window.location = "login.html";
    }
}

function updateTeacherObject(json) {
    if (json["success"]) {
        var teacher = setUpTeacherObject(json["response"]);
        var session_user = JSON.parse(sessionStorage.getItem("user"));
        session_user["UserObject"] = teacher;
        sessionStorage.setItem("user", JSON.stringify(session_user));
        return true;
    } else {
        console.log(json["message"]);
        if (json["ex_message"] != undefined ) console.log(json["ex_message"]);
        sessionStorage.setItem("user", JSON.stringify([]));
        return false;
    }
}

function requestTeacherError(json) {
    /* TODO Fail sensibly */
    console.log(json.statusText);
}

function setUpTeacherObject(teacher) {
    teacher["fullName"] = teacher.Forename + " " + teacher.Surname;
    teacher["studentName"] = teacher.Title + " " + teacher.Surname;
    teacher["shortInitials"] = teacher.Forename.charAt(0) + teacher.Surname.charAt(0)
    return teacher;
}

function logOutUser() {
    sessionStorage.setItem("user", "");
}

function clickLogOut() {
    logOutUser();
    window.location = "login.html";
}

/* Initialise header details */
function initPage() {
    initHeader();
    initSidebar();
}

function initHeader() {
    $("#short_name").html(teacher.shortInitials);
    $("#long_name").html(teacher.fullName);
}

function initSidebar() {
    var sidebar_html = "<a href='#' class='top'></a>";
    sidebar_html += addSideBarOption("index.html", "Dashboard");
    if (parseInt(teacher.TutorCount) > 0) sidebar_html += addSideBarOption("tutor.html", "Tutor");
    if (teacher.Sets && teacher.Sets.length > 0) sidebar_html += addSideBarOption("#", "Teacher");
    if (teacher.HM && teacher.HM.length > 0) sidebar_html += addSideBarOption("#", "HM");
    if (teacher.HOD && teacher.HOD.length > 0) sidebar_html += addSideBarOption("#", "HOD");
    $("#sidebar").html(sidebar_html);
}

function addSideBarOption(link, title) {
    sidebar_count++;
    var html_text = "<a href='" + link + "'>";
    html_text += "<div class='sidebar_image'></div>";
    html_text += "<h2>" + title + "</h2></div>";
    return html_text;
}
