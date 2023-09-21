# Project 3: Group 10
*Andrew McLaughlin, Mohamed Irfhan Varvani, Tran Thuy Van Phan* 

This is the repository for Monash University Bootcamp Project 3 (Group 10).
The goal of this Project is to tell a story using data visualisations with interactivity allowing users to explore the data on their own. 

*Which postcode in the Yarra Ranges LGA has the highest count of accidents?*  <br>
*Which age group has the highest accident count?*  <br>

>EXPLORE THE DATASET HERE: (TBC Link to dashboard on Git Pages)

## Project Theme 🚗 🚦 🚸  💥 🚑  →  💰 📋 📊 🛡️ 
We have chosen a local car accidents dataset to assist with trends and insights to help a car insurance company.

A hypothetical Victorian Car Insurance Company has hired Group 10 to build a dashboard to help their employees visualise accident trends throughout Victoria and to also help set insurance premiums. 

## Data Resources:
 - Our primary dataset was sourced from the Victorian Government located [HERE](https://discover.data.vic.gov.au/dataset/crash-stats-data-extract/resource/f9c7c05a-19e9-4593-aa2c-960a9c97b858)
 - We also sourced VIC Local Government Area (LGA) boundary GeoJSON data to map our LGA polygons via this dataset:  <br>
 [https://data.gov.au/dataset/ds-dga-bdf92691-c6fe-42b9-a0e2-a4cd716fa811/distribution/dist-dga-ce0a0ed3-6003-47fd-88ad-4b49d9337d47/details?q=](https://data.gov.au/dataset/ds-dga-bdf92691-c6fe-42b9-a0e2-a4cd716fa811/distribution/dist-dga-ce0a0ed3-6003-47fd-88ad-4b49d9337d47/details?q=)  <br>
 - The primary dataset spans 5 years of accident data throughout Victoria.
 - We focused on 4 of the CSVs in the dataset: "ACCIDENT", "NODE", "PERSON", and "VEHICLE. The raw CSV files for these can be found in the [Resources folder](https://github.com/amcl11/Project_3_Group_10/tree/main/Resources).
 - The files are as follows:

      - **ACCIDENT.CSV** - Basic accident details, time, severity, location <br>
        <br>
        *Note: severity is measured as follows: 1 = Fatal accident,  2 = Serious injury accident,  3 = Other injury accident, 4 = Non injury accident*
      
      - **PERSON.CSV** - Person based details, age, sex etc.
      
      - **VEHICLE.CSV** - Vehicle based data, vehicle type, make etc.
      
      - **NODE.CSV** - Includes accident Lat/Long references for mapping.

## Files:
 - "AU_Accidents.ipynb" - Importing raw CSV files, data cleaning, SQLite database import.
 - "geo_pandas.ipynb" - Used to convert .SHP file to GeoJSON
 - "Flask_API.py" - Connection to database, API routes created for front-end data access.
 - "index.html"
 - "script.js"
 - "lgaColors.js" - Color function for Leaflet polygons
 - "style.css"
 - "vic_lga.geojson" - Used to map LGA polygons 

## API Documentation:
---

### Base URL
All URLs referenced in the API documentation are relative to `http://127.0.0.1:5000/`.

---

### Endpoints

#### 1. `/`
- **Method**: `GET`
- **Description**: The home route that serves the main HTML page.
- **Response Type**: HTML
- **Example URL**: `http://127.0.0.1:5000/`

---

#### 2. `/all_accidents`
- **Method**: `GET`
- **Description**: Retrieves all accident locations. Optionally, you can filter by severity.
- **Query Parameters**: 
  - `severity`: An integer that specifies the severity level ranging from 1 - 4 (1 being the most severe)
- **Response Type**: JSON (GeoJSON)
- **Example URL**: `http://127.0.0.1:5000/all_accidents?severity=3`

---

#### 3. `/accidents_by_LGA`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents and the postcode with the highest number of accidents for each Local Government Area (LGA).
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/accidents_by_LGA`
- **Sample Response**:

```json
[
  {
    "LGA Name": "BALLARAT",
    "Postcode with highest no. accidents": "3350",
    "Total LGA Accidents": 1091
  },
]
```

---

#### 4. `/person_info`
- **Method**: `GET`
- **Description**: Retrieve information related to individuals involved in the accidents, such as age group, gender, and owner's postcode.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/person_info`

---

#### 5. `/vehicle_info`
- **Method**: `GET`
- **Description**: Retrieve vehicle-related information for each accident, such as the year of manufacture, vehicle power, make, and body style.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/vehicle_info`

---

#### 6. `/total_accidents_by_make`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by vehicle make.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/total_accidents_by_make`

---

#### 7. `/total_accidents_by_manufacture_year`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by the year of vehicle manufacture.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/total_accidents_by_manufacture_year`

---

#### 8. `/total_accidents_by_power`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by vehicle power.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/total_accidents_by_power`

---

#### 9. `/total_accidents_by_body_style`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by vehicle body style.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/total_accidents_by_body_style`

---

#### 10. `/accidents_by_age_group`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by age group.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/accidents_by_age_group`

---

#### 11. `/accidents_by_year`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by the year the accident occurred.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/accidents_by_year`

---

#### 12. `/accidents_by_gender`
- **Method**: `GET`
- **Description**: Retrieve the total number of accidents grouped by gender.
- **Response Type**: JSON
- **Example URL**: `http://127.0.0.1:5000/accidents_by_gender`

---


