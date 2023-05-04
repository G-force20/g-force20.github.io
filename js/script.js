$(document).ready(() => {
    $.getJSON("data.json", (data) => {
        console.log("read")
        console.log(data)
    });
});