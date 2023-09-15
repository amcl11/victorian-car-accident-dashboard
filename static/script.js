// import lgaColors file
import { lgaColors } from './lgaColors.js';

// Initialise map centered at the middle of Victoria, Australia
let mymap = L.map('mapid').setView([-37.8136, 144.9631], 7.5);

// Add OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// link to GeoJSON LGA data.
let link = "https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json";

// Function to choose color
function chooseColor(lgaName) {
    return lgaColors[lgaName] || '#000000'; // Default to black
}

// Retrieve GeoJSON data
d3.json(link).then(function(data) {
    L.geoJson(data, {
        style: function(feature) {
            return {
                color: "white",
                // Call the chooseColor() function to decide color based on LGA Name 
                fillColor: chooseColor(feature.properties.vic_lga__3),
                fillOpacity: 0.5,
                weight: 1.5
            };
        },

        onEachFeature: function(feature, layer) {
            // Set mouse events to change the map styling
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                    // Display LGA name on hover
                    layer.bindPopup('<h2 class="popup-title">' + feature.properties.vic_lga__3 + '</h2>').openPopup();

                },
                mouseout: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                click: function(event) {
                    mymap.fitBounds(event.target.getBounds());
                }
            });
        }
    }).addTo(mymap);
});
  

