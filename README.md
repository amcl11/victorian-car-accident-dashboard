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
 - We also sourced VIC Local Government Area (LGA) boundary GeoJSON data to map our LGA polygons via this dataset[https://data.gov.au/dataset/ds-dga-bdf92691-c6fe-42b9-a0e2-a4cd716fa811/distribution/dist-dga-ce0a0ed3-6003-47fd-88ad-4b49d9337d47/details?q=](https://data.gov.au/dataset/ds-dga-bdf92691-c6fe-42b9-a0e2-a4cd716fa811/distribution/dist-dga-ce0a0ed3-6003-47fd-88ad-4b49d9337d47/details?q=)
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
 - "Flask_API.py" - Connection to database, API routes created for front-end data access.
 - "Index.html"
 - "Logic.js"
 - "Style.css"

