$(document).ready(function(){
    //document.documentElement.style.setProperty('--header-height', "100px");
})

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
