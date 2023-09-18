// Import lgaColors file
import { lgaColors } from './lgaColors.js';

// Initialise map centered at the middle of Victoria, Australia
let mymap = L.map('mapid').setView([-37.8136, 144.9631], 7.5);

// Add OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Link to GeoJSON LGA data
let link = "https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json";

// Fetch LGA details from Flask API
let lgaDetails = [];

fetch('/accidents_by_LGA')
  .then(response => response.json())
  .then(data => {
    lgaDetails = data;
  });

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
                click: async function(event) {
                    // Zoom to bounds
                    mymap.fitBounds(event.target.getBounds());
                
                    // Fetch data from the Flask API
                    let response = await fetch('http://127.0.0.1:5000/accidents_by_LGA');
                    if (response.status !== 200) {
                        console.log('Error fetching data:', response.status);
                        return;
                    }
                    let lgaDetails = await response.json();
                    
                    // Extract clicked LGA name
                    let clickedLgaName = feature.properties.vic_lga__3;
                
                    // Find matching LGA details from fetched data
                    let exampleLga = lgaDetails.find(lga => lga['LGA Name'] === clickedLgaName) || {};
                
                    // Create popup content
                    let popupContent = `
                        <strong>LGA Name:</strong> ${exampleLga['LGA Name'] || 'N/A'}<br>
                        <strong>Total LGA Accidents:</strong> ${exampleLga['Total LGA Accidents'] || 'N/A'}<br>
                        <strong>Postcode with highest no. accidents:</strong> ${exampleLga['Postcode with highest no. accidents'] || 'N/A'}
                    `;
                
                    // Display popup
                    L.popup()
                      .setLatLng(event.latlng)
                      .setContent(popupContent)
                      .openOn(mymap);
                }
            });
        }
    }).addTo(mymap);
});


