/// Add console.log to check to see if our code is working
console.log("working");

// We create the tile layer that will be the background of our map.
let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5
    
});

basemap.addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        
    }};

        function getRadius(magnitude) {
            if (magnitude === 0) {
                return 1;
            }

            return magnitude * 4;
        }

        function getColor(depth) {
            switch (true) {
                case depth > 90:
                    return "#ea2c2c";
                case depth > 70:
                    return "#ea822c";
                case depth > 50:
                    return "#ee9c00";
                case depth > 30:
                    return "#eecc00";
                case depth > 10:
                    return "#d4ee00";
                default:
                    return "#98ee00";
            }
        };
        

        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng)
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<strong>" + feature.properties.place+ "</strong><br /><br />magnitude: " +
                  feature.properties.mag + "<br /><br />Depth: " + feature.geometry.coordinates[2]);
              },
          
            style: styleInfo,
        

})
    


.addTo(myMap);


let legend = L.control({
    position: "bottomright"
});

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
}

legend.addTo(myMap);

});