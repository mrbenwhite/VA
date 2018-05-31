var mobile_screen = false;

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
