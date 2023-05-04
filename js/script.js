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
        document.getElementById("mainmap"),{ 
            zoom: 17, 
            mapID: "189e08e61aca378d",
            center: {
                lat:40.60825025820167,
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
    for(let name in data) {
    // data.forEach((building) => {
        let building = data[name]
        // console.log(building)
        building.clicked = false;
        building.marker = new google.maps.Marker({ 
            position: building.pos, 
            map: map,
            title: building.name,
            icon: selectPin(building.access)
         });
        building.marker.addListener("click", () => {
            // console.log(building.name+"clicked");
            $("#mainmapinfo").html($("<h2></h2>").text(building.name+": "));
            $("#mainmapinfo").append($("<li></li>").text("Elevator: "+building.elevator));
            $("#mainmapinfo").append($("<li></li>").text("Accessibility: "+building.access));
            $("#mainmapinfo").append($("<li></li>").text("Accessible entrances: "+building.entrances));
            $("#mainmapinfo").append($("<li></li>").text("Additional info: "+building.additional));
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
            
            point.marker = new google.maps.Marker({ 
                position: point.pos, 
                map: map,
                icon: selectPin(point.type) 
            });
            point.marker.addListener("click", () => {
                showAttributes(point);
            });
        
        });
        building.clicked=true;
    }
}

function showAttributes(point){
    let imgtxt = '<br><li>'+point.type+':</li>'
    imgtxt += '<img src="pictures/'+point.img+'.jpg" ';
    imgtxt += 'alt="a photo of '+point.img+'">';
    $("#pinimg").html(imgtxt)
    console.log(imgtxt)
}

function selectPin(attr) {
    let icon = {
        path: 'icons/',
        scaledSize: new google.maps.Size(50,50)
    }
    switch (attr.toLowerCase()) {
        // change this to a dictrionary of strings later.
        // scales don't work, need to resize picture
        case "fully":
            icon.path += 'green_pin_s.png'
            break;
        case "partially":
            icon.path += 'yellow_pin_s.png'
            break;
        case "inaccessible":
            icon.path += 'red_pin_s.png'
            break;
        case "parking":
            icon.path += 'parking_pin_s.png'
            break;
        case "entrance":
            icon.path += 'red_pin_s.png'
            break;
        case "lift":
            icon.path += 'red_pin_s.png'
            break;
        default:
            icon.path += 'red_pin_s.png'
            break;
    }
    return icon.path;
}