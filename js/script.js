$(document).ready(() => {
    $.getJSON("js/data.json", (data) => {
        console.log("read")
        console.log(data)
    });
});