let carte = null;   // the map
let lat = [];       // array of latitudes
let lon = [];       // array of longitudes
let height = [];    // array of altitudes


/** 
* Compute the average of an array.
* @param {Array} arr - the array to sum up, only works with numeric 1D array.
* @return {Number} The calculated average.
*/
const avg = arr => arr.reduce((acc, v, i, a) => (acc + v / a.length), 0);


/** 
* Get a scale of dates between two dates.
* @summary Generated n dates evenly distributed between two points.
* @param {Date} start - The starting point.
* @param {Date} end - The ending point.
* @param {Int} n - The number of dates to generate.
* @return {Date[]} The array of generated dates.
*/
const getDatesBetween = (start, end, n) => {
    // time difference between the two dates divided by the number of dates gives us the step
    const step = Math.ceil((end.getTime() - start.getTime()) / n)
    let dates = [];
    let current = new Date(start);
    for (i = 0; i < n; i++) {
        dates.push(new Date(current));
        current.setTime(current.getTime() + step);
    }
    return dates;
};

/** 
* Generate some stats from the geojson file.
* @param {JSON} geojson - A parsed geojson file.
* @return {Int[]} The duration of the trip, the length of the route and the cumulative elevation difference.
*/
function compute_stats(geojson) {
    // duration is already indicated in the geojson
    const time_length = endDate.getDate() - startDate.getDate();

    // route length is also indicated in the geojson, just need to convert it into kilometers
    const total_length = geojson.features[0].properties["track-length"] / 1000

    // cumulative elevation difference is the sum of every positive elevation difference
    let denivele = 0;
    for (let i = 1; i < height.length; i++) {
        if (height[i] > height[i - 1]) {
            denivele += height[i] - height[i - 1];
        }
    }

    return [time_length, total_length, denivele / 1000];
}

/** 
* Get the dsitance in kilometers between two points given their latitudes and longitudes.
* @param {Number} lat1 - latitude of first object.
* @param {Number} lat2 - latitude of second object.
* @param {Number} lon1 - longitude of first object.
* @param {Number} lon2 - longitude of second object.
* @return {Number} The distance in kilometers.
*/
function distLatLon(lat1, lat2, lon1, lon2) {
    // convert to radians
    const radlat1 = Math.PI * lat1 / 180,
        radlat2 = Math.PI * lat2 / 180,
        radlon1 = Math.PI * lon1 / 180,
        radlon2 = Math.PI * lon2 / 180;
    const dlon = radlon2 - radlon1,
        dlat = radlat2 - radlat1;

    // use Haversine formula
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(radlat1)
        * Math.cos(radlat2)
        * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let dist = 6378 * c     // 6378 being earth mean radius in kilometers

    return dist;
};


/** 
* Find the closest points of a trace to a marker.
* @param {Number} latVar - latitude of the marker.
* @param {Number[]} latArr - array of latitudes for the trace.
* @param {Number} lonVar - longitude of the marker.
* @param {Number[]} lonArr - array of longitude for the trace.
* @param {Number} delta=5 - the maximum distance to accept the point.
* @return {Numbe} The median index between the closest objects. 
*/
function findClose(latVar, latArr, lonVar, lonArr, delta = 5) {
    let closeIdx = [];

    for (let i = 0; i < latArr.length; i++) {
        if (distLatLon(latVar, latArr[i], lonVar, lonArr[i]) <= delta) {
            closeIdx.push(i);
        }
    }
    return closeIdx[Math.round(closeIdx.length / 2)];
};

/** 
* Initialize the map. Set the default position of the map and the attribution text.
*/
function initMap() {
    carte = L.map('map').setView([avg(lat), avg(lon)], 7);  // center the map on the mean coordinates of the route
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> - rendu <a href="https://www.openstreetmap.fr">OSM France</a>',
        minZoom: 2,
        maxZoom: 15
    }).addTo(carte);
}

/** 
* Function applied on every feature of the layer.
* @summary This will serve to initialize the 'lat', 'lon' and 'height' arrays and to bind popups to the trip's waypoints.
* @param {L.Objects} feature - Objects that are specific to Leaflet.
* @param {L.Objects} layer - Objects that are specific to Leaflet.
*/
function forEachFeature(feature, layer) {
    // if the object is a waypoint
    if (layer instanceof L.Marker) {
        // bind a popup containing its name
        const name = feature.properties.name;
        const popupContent = "<p> <b>Nom: </b>" + name + "</p>";
        layer.bindPopup(popupContent);
        // if it's a point of the route
    } else if (layer instanceof L.Path) {
        // put its three coordinates in the corresponding arrays
        const coords = feature.geometry.coordinates;
        coords.map(e => {
            lon.push(e[0]);
            lat.push(e[1]);
            height.push(e[2])
        });
    }
}


/** 
* Launch when the window and its objects are properly loaded.
*/
window.onload = function () {
    // parse the geosjon loaded in the html page
    const geojson = JSON.parse(trace);

    // make a leaflet layer from the geojson
    let geojsonLayer = L.geoJSON(geojson, {
        onEachFeature: forEachFeature,
        style: {
            "color": "#839c49",
            "opacity": 1,
            "weight": 5,
            "fillColor": "#839c49",
            "fillOpacity": 0.5
        }
    });

    // initialize the map and add the geojson layer to it
    initMap();
    geojsonLayer.addTo(carte);

    // compute and display some statistics about the trip
    let global_stats = compute_stats(geojson);
    document.getElementById("stats").innerHTML = `Ce voyage a duré ${global_stats[0]} jours, sur ${Math.round(global_stats
    [1])} km et avec un dénivelé cumulé de ${global_stats[2].toPrecision(2)} km`;

    // make a red icon that will be used for the movable marker
    let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // make the movable marker and add it to the map at the middle point of the trip
    let marker = new L.Marker(
        [
            lat[Math.round(lat.length / 2)],
            lon[Math.round(lon.length / 2)]
        ],
        {
            icon: redIcon
        }).addTo(carte);

    // settings and data for the altitude plot
    let myPlot = document.getElementById("plot");
    let dates = getDatesBetween(startDate, endDate, height.length);
    let data = [{
        x: dates, y: height, name: 'Parcours',
        type: 'scatter', mode: 'line', line: { color: "#839c49" }
    },
    {
        x: [
            dates[Math.round(dates.length / 2)]
        ],
        y: [
            height[Math.round(height.length / 2)]
        ],
        name: 'Marqueur', type: 'scatter', mode: 'markers',
        marker: { size: 15, color: "#CB2B3E" }
    }];
    let layout = {
        hovermode: 'closest',
        xaxis: { type: 'date', title: "Date" },
        yaxis: { title: "Altitude (en mètres)" }
    };
    let config = { responsive: true };

    // make the altitude plot
    Plotly.newPlot("plot", data, layout, config);

    // make the trace on the plot clickable and move the marker to the clicked point
    myPlot.on("plotly_click", function (data) {
        const pn = data.points[0].pointNumber;
        const pLat = lat[pn];
        const pLon = lon[pn];

        // also make the marker move on the map
        marker.setLatLng([pLat, pLon]);
        carte.panTo([pLat, pLon]);

        Plotly.restyle(myPlot, {
            x: [[data.points[0].x]],
            y: [[data.points[0].y]]
        }, [1]);
    });

    // make the geojson layer also clickable to move the marker to the clicked point
    geojsonLayer.on('click', function (e) {
        marker.setLatLng(e.latlng);

        let closest = findClose(e.latlng.lat, lat, e.latlng.lng, lon);

        // also make the marker move on the plot
        Plotly.restyle(myPlot, {
            x: [[dates[closest]]],
            y: [[height[closest]]]
        }, [1]);
    });
};

