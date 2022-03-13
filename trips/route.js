let carte = null;
let lat = [];
let lon = [];
let height = [];

const avg = arr => arr.reduce((acc, v, i, a) => (acc + v / a.length), 0);

// generate time serie
const getDatesBetween = (start, end, n) => {
    const step = Math.ceil((end.getTime() - start.getTime()) / n)
    let dates = [];
    let current = new Date(start);
    for (i = 0; i < n; i++) {
        dates.push(new Date(current));
        current.setTime(current.getTime() + step);
    }
    return dates;
};

function distLatLon(lat1, lat2, lon1, lon2) {
    let radlat1 = Math.PI * lat1 / 180,
        radlat2 = Math.PI * lat2 / 180,
        radlon1 = Math.PI * lon1 / 180,
        radlon2 = Math.PI * lon2 / 180;

    let dlon = radlon2 - radlon1,
        dlat = radlat2 - radlat1;

    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(radlat1)
        * Math.cos(radlat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let dist = 6378 * c

    return dist;
};

function findClose(latVar, latArr, lonVar, lonArr) {
    let closeIdx = [];

    for (let i = 0; i < latArr.length; i++) {
        if (distLatLon(latVar, latArr[i], lonVar, lonArr[i]) <= 5) {
            closeIdx.push(i);
        }
    }
    return Math.round(avg(closeIdx));
};

// Fonction d'initialisation de la carte
function initMap() {
    // Créer l'objet "carte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    carte = L.map('map').setView([avg(lat), avg(lon)], 7);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> - rendu <a href="https://www.openstreetmap.fr">OSM France</a>',
        minZoom: 2,
        maxZoom: 15
    }).addTo(carte);
}

function forEachFeature(feature, layer) {
    if (layer instanceof L.Marker) {
        const name = feature.properties.name;
        const popupContent = "<p> <b>Nom: </b>" + name + "</p>";
        layer.bindPopup(popupContent);
    } else if (layer instanceof L.Path) {
        let coords = feature.geometry.coordinates;  //gets feature coords
        for (let i = 0; i < coords.length; i++) { //loop thru coords to get Z's
            lon.push(coords[i][0]);
            lat.push(coords[i][1]);
            height.push(coords[i][2]);
        }
    }
}

window.onload = function () {
    const geojson = JSON.parse(trace);
    // On dessine le polygone
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

    initMap();

    // On ajoute à la carte
    geojsonLayer.addTo(carte);

    let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let marker = new L.Marker([
        lat[Math.round(lat.length / 2)],
        lon[Math.round(lon.length / 2)]
    ],
        {
            icon: redIcon
        }).addTo(carte);

    // altitude plot
    let myPlot = document.getElementById("plot");
    let dates = getDatesBetween(startDate, endDate, height.length);
    let data = [{
        x: dates, y: height, name: 'Trace',
        type: 'scatter', mode: 'line'
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

    // display with Plotly
    Plotly.newPlot("plot", data, layout, config);

    myPlot.on("plotly_click", function (data) {
        const pn = data.points[0].pointNumber;
        const pLat = lat[pn];
        const pLon = lon[pn];

        marker.setLatLng([pLat, pLon]);

        Plotly.restyle(myPlot, {
            x: [[data.points[0].x]],
            y: [[data.points[0].y]]
        }, [1]);
    });

    geojsonLayer.on('click', function (e) {
        marker.setLatLng(e.latlng);

        let closest = findClose(e.latlng.lat, lat, e.latlng.lng, lon);

        Plotly.restyle(myPlot, {
            x: [[dates[closest]]],
            y: [[height[closest]]]
        }, [1]);
    });
};

