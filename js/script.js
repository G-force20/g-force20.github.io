$(document).ready(() => {
    $.getJSON("https://g-force20.github.io/js/marker.json", (data) => {
        console.log("read")
        console.log(data)
    });
});
