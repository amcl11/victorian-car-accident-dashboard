// Import lgaColors file
import { lgaColors } from './lgaColors.js';
// Initialize map centered at the middle of Victoria, Australia
let mymap = L.map('mapid').setView([-37.8136, 144.9631], 7);
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
async function drawBarChart(filterBy) {
    let apiEndpoint = "";
    let xLabel = "";
    let dataKey = "";
    switch (filterBy) {
      case 'ageGroup':
        apiEndpoint = "http://127.0.0.1:5000/accidents_by_age_group";
        xLabel = "Age Group";
        dataKey = "Age Group";
        break;
      case 'gender':
        apiEndpoint = "http://127.0.0.1:5000/accidents_by_gender";
        xLabel = "Gender";
        dataKey = "Gender";
        break;
      case 'year':
        apiEndpoint = "http://127.0.0.1:5000/accidents_by_year";
        xLabel = "Accident Year";
        dataKey = "Accident Year";
        break;
    }
    const response = await fetch(apiEndpoint);
    if (response.status !== 200) {
      console.error('Error fetching data:', response.status);
      return;
    }
    const data = await response.json();
    // Prepare data for Plotly
    const xValues = data.map(d => d[dataKey]);
    const yValues = data.map(d => d['Total Accidents']);
    const trace1 = {
      x: xValues,
      y: yValues,
      type: "bar",
      text: yValues.map(String),
      textposition: 'auto',
      hoverinfo: 'x+y',
      marker: {
        color: 'blue'
      }
    };
    const layout = {
      xaxis: {
        title: {
          text: xLabel,
        },
      },
      yaxis: {
        title: {
          text: 'Total Accidents',
          standoff: 10, // Adds padding between title and tick labels
        }
      },
      plot_bgcolor: '#f9f7e6cf', // Color of plotting area
      paper_bgcolor: '#F7F7E6',  // Color of the entire paper
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4,
        bgcolor: '#C7C7C7' // Color of margins
      }
    };
    // Draw the chart
    Plotly.newPlot('barGraph', [trace1], layout);
  }
  document.addEventListener("DOMContentLoaded", function() {
    const filterDropdown = document.getElementById("filterCategory");
    filterDropdown.addEventListener("change", function() {
      drawBarChart(this.value);
    });
    // Draw initial chart
    drawBarChart("ageGroup");
  });


// Function to create Highcharts chart
function createHighchartsChart(attribute) {
  const apiUrl = `http://127.0.0.1:5000/total_accidents_by_${attribute}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Sort the data by accident count in descending order
      const sortedData = Object.entries(data[`by${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`])
        .map(([name, count]) => ({
          name: name.trim(),
          y: count
        }))
        .sort((a, b) => b.y - a.y);
      // Select the top ten items
      const topTenData = sortedData.slice(0, 10);
      Highcharts.chart('chartContainer', {
        chart: {
          type: 'bar',
          backgroundColor: '#f9f7e6cf', // Changing background color
        },
        title: {
          text: `Top Ten Accident count by Vehicle ${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`,
          style: {
            color: '#3679dc',
            font: 'bold 16px "Courier New", monospace'
          }
        },
        xAxis: {
          categories: topTenData.map(item => item.name),
          title: {
            style: {
              color: '#48F7BA',
              font: 'bold 12px "Courier New", monospace'
            }
          },
          labels: {
            style: {
              color: '#666',
              font: '11px Arial, sans-serif'
            }
          }
        },
        yAxis: {
          title: {
            text: 'Total Accidents',
            style: {
              color: '#666',
              font: 'bold 12px "Courier New", monospace'
            }
          }
        },
        series: [{
          name: `${attribute.charAt(0).toUpperCase() + attribute.slice(1)}`,
          data: topTenData.map(item => item.y),
          color: '#7723F9' // Change the bar color
        }],
      });
    })
    .catch(error => console.error('Error:', error));
}
// Event listener for the dropdown menu
document.addEventListener("DOMContentLoaded", function() {
  const chartDropdown = document.getElementById("chartDropdown");
  chartDropdown.addEventListener("change", function() {
    const selectedAttribute = this.value;
    createHighchartsChart(selectedAttribute);
  });
  // Initialize the chart with the default attribute (e.g., "make")
  createHighchartsChart("make");
});