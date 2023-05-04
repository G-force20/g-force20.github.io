$(document).ready(() => {
    $.getJSON("https://g-force20.github.io/js/data.json", (data) => {
        console.log("read")
        console.log(data)
    });
});
