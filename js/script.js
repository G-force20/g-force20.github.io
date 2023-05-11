// read data from json
let data, map, shown = [], load;

$(document).ready(() => {
    $.getJSON("https://g-force20.github.io/js/data.json", (response) => {
        // console.log("read")
        // console.log(response)
        data = response;
    });
    // load google map API
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: "AIzaSyClit8oNyG7-uK0tOxGAgX9imqLrWm3RPc",
        version: "weekly",
        libraries: ["maps"]//, "marker"]
    });
    load = loader.load().then(initMap);
});



function initMap() {
    map = new google.maps.Map(
        document.getElementById("mainmap"), {
        zoom: 17,
        mapID: "189e08e61aca378d",
        center: {
            lat: 40.60825025820167,
            lng: -75.37765792302574
        },
        minZoom: 15,
        restriction: {
            latLngBounds: {
                north: 40.61563243158127,
                south: 40.596741814117735,
                east: -75.34953258447779,
                west: -75.39170066258816
            }
        }
    }
    );
    for (let name in data) {
        let building = data[name]
        building.clicked = false;
        building.marker = new google.maps.Marker({
            position: building.pos,
            map: map,
            title: building.name,
            animation: google.maps.Animation.DROP,
            icon: selectPin(building.access)
        });
        building.marker.addListener("click", () => {
            $("#mainmapinfo").html($("<h2></h2>").text(building.name + ": "));
            $("#mainmapinfo").append($("<li></li>").text("Elevator: " + building.elevator));
            $("#mainmapinfo").append($("<li></li>").text("Accessibility: " + building.access));
            $("#mainmapinfo").append($("<li></li>").text("Accessible entrances: " + building.entrances));
            $("#mainmapinfo").append($("<li></li>").text("Additional info: " + building.additional));
            $("#mainmapinfo").append('<div id="pinimg"></div>');
            loadMarkers(name);
        });
    }//);
}

function loadMarkers(name) {
    let building = data[name];
    shown.forEach((point) => {
        point.marker.setMap(null);
    });

    shown = building.points;
    if (building.clicked) {
        //makes sure we don't have to initialize new markers if the building has been clicked on
        // console.log("reused")
        shown.forEach((point) => {
            point.marker.setAnimation(google.maps.Animation.DROP);
            point.marker.setMap(map);
        });
    }
    else {
        // console.log("new")
        shown.forEach((point) => {

            point.marker = new google.maps.Marker({
                position: point.pos,
                map: map,
                icon: selectPin(point.type),
                animation: google.maps.Animation.DROP
            });
            point.marker.addListener("click", () => {
                showAttributes(point);
            });

        });
        building.clicked = true;
    }
}

function showAttributes(point) {
    let imgtxt = '<br><li>' + point.type + ':</li>'
    imgtxt += '<img src="pictures/' + point.img + '.jpg" ';
    imgtxt += 'alt="a photo of ' + point.img + '">';
    $("#pinimg").html(imgtxt)
    console.log(imgtxt)
}

function selectPin(attr) {
    // console.log(attr)
    let icon = {
        path: 'icons/',
        scaledSize: new google.maps.Size(50, 50),
        scale: 0.004
    }
    switch (attr.toLowerCase()) {
        // change this to a dictrionary of strings later.
        // scales don't work, need to resize picture
        case "fully accessible":
            icon.path += 'dark_blue.png'
            break;
        case "partially accessible":
            icon.path += 'blue.png'
            break;
        case "inaccessible":
            icon.path += 'light_blue.png'
            break;
        case "parking":
            icon.path += 'parking_pin.png'
            break;
        case "entrance":
            icon.path += 'door.png'
            break;
        case "exit":
            icon.path += 'door.png'
            break;
        case "not_entrance":
            icon.path += 'inaccessible.png'
            break;
        case "lift":
            icon.path += 'lift.png'
            break;
        case "shower":
            icon.path += 'shower.png'
            break;
        default:
            icon.path += 'peach.png'
            break;
    }
    return icon.path;
}