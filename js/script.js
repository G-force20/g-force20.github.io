// read data from json
let data, map, shown = [], load;

$(document).ready(() => {
    // $.getJSON("https://g-force20.github.io/js/markers.json", (response) => {
    $.getJSON("https://g-force20.github.io/js/data.json", (response) => {
        // console.log("read")
        // console.log(response)
        data = response;
    });
    // load google map API
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: "AIzaSyClit8oNyG7-uK0tOxGAgX9imqLrWm3RPc", //restricted to github
        // apiKey: "AIzaSyA84in0zBFSZRcfH5Hpb_l0X1eBrn9vI7E", //unrestriced, keep private
        version: "weekly",
        libraries: ["maps"]//, "marker"]
    });
    load = loader.load().then(initMap);
});



function initMap() {
    // let steps = { lat: 40.608381759451525, lng: -75.37842078555052 }
    // console.log(data.steps.pos)
    map = new google.maps.Map(
        document.getElementById("mainmap"),
        { zoom: 18, center: data[0].pos }
    );
    data.forEach((building) => {
        building.clicked = false;
        building.marker = new google.maps.Marker({ 
            position: building.pos, 
            map: map,
            title: building.name
         });
        building.marker.addListener("click", () => {
            // console.log(building.name+"clicked");
            $("#mainmapinfo").html(building.name+": ");
            $("#mainmapinfo").append($("<li></li>").text("Elevator: "+building.elevator));
            $("#mainmapinfo").append($("<li></li>").text("Accessibility: "+building.access));
            $("#mainmapinfo").append($("<li></li>").text("Accessible entrances: "+building.entrances));
            $("#mainmapinfo").append($("<li></li>").text("Additional info: "+building.additional));
            loadMarkers(building);
        });
    });
}

function loadMarkers(building) {
    shown.forEach((point) => {
        point.marker.setMap(null);
    });

    shown = building.points;
    if(building.clicked){
        //makes sure we don't have to initialize new markers if the building has been clicked on
        // console.log("reused")
        shown.forEach((point) => {
            point.marker.setMap(map);
        });
    }
    else{
        // console.log("new")
        shown.forEach((point) => {
            // console.log(pic +" "+index);
            point.marker = new google.maps.Marker({ position: point.pos, map: map });
            point.marker.addListener("click", () => {
                showAttributes(point);
            });
        
        });
        building.clicked=true;
    }
}

function showAttributes(point){
    console.log(point.img)
}
