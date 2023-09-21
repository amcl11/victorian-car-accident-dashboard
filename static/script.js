console.log("Script loaded");
import { lgaColors } from './lgaColors.js';

let mymap = L.map('mapid').setView([-37.8136, 144.9631], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

let link = 'static/vic_lga.geojson';

let lgaDetails = [];

fetch('/accidents_by_LGA')
  .then(response => response.json())
  .then(data => {
    lgaDetails = data;
    console.log("Fetched LGA Details:", lgaDetails);
  })
  .catch(err => {
    console.error('Fetch error:', err);
  });

  function chooseColor(lgaName) {
    const color = lgaColors[lgaName] || '#000000';
    return color;
}



d3.json(link).then(function(data) {
  console.log("Loaded GeoJSON Data:", data);

  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.ABB_NAME),
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    onEachFeature: function(feature, layer) {
      const originalPopupContent = `<h2 class="popup-title">${feature.properties.ABB_NAME}</h2>`;
      // Bind popup with LGA name for mouseover
      layer.bindPopup(originalPopupContent);

      layer.on({
        mouseover: function(event) {
          let hoverLayer = event.target;
          hoverLayer.setStyle({ fillOpacity: 0.9 });
          hoverLayer.setPopupContent(originalPopupContent); // Reset the popup content
          hoverLayer.openPopup();  // Open the popup on mouseover
        },
        mouseout: function(event) {
          event.target.setStyle({ fillOpacity: 0.5 });
        },
        click: function(event) {
          let clickLayer = event.target;
          mymap.fitBounds(clickLayer.getBounds());

          let clickedLgaName = feature.properties.ABB_NAME;
          let exampleLga = lgaDetails.find(lga => lga['LGA Name'].trim().toUpperCase() === clickedLgaName.trim().toUpperCase()) || {};

          let popupContent = `
            <strong>LGA Name:</strong> ${exampleLga['LGA Name'] || 'N/A'}<br>
            <strong>Total LGA Accidents:</strong> ${exampleLga['Total LGA Accidents'] || 'N/A'}<br>
            <strong>Postcode with highest no. accidents:</strong> ${exampleLga['Postcode with highest no. accidents'] || 'N/A'}
          `;

          // Update the popup content for the click event and reopen
          layer.setPopupContent(popupContent);
          layer.openPopup();
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
        color: '#BF80BC'
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
          text: (`TOP TEN ACCIDENT COUNT BY VEHICLE ${attribute}`).toUpperCase(),
          style: {
            color: '#e99000',
            font: 'normal 18px "Courier New", monospace'
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
          color: '#3679dc' // Change the bar color
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
  // Initialise the chart with the default attribute (e.g., "make")
  createHighchartsChart("make");
});