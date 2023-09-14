# Project 3: Group 10
*Andrew McLaughlin, Mohamed Irfhan Varvani, Tran Thuy Van Phan* 

This is the repository for Monash University Bootcamp Project 3 (Group 10).
The goal of this Project is to tell a story using data visualisations with interactivity allowing users to explore the data on their own. 

>EXPLORE THE DATASET HERE: (TBC Link to dashboard on Git Pages)

## Project Theme 🚗 🚦 🚸  💥 🚑  →  💰 📋 📊 🛡️ 
We have chosen a local car accidents dataset to assist with trends and insights to help a car insurance company.

A hypothetical Victorian Car Insurance Company has hired Group 10 to build a dashboard to help their employees visualise accident trends throughout Victoria and to also help set insurance premiums. 

## Data Resources:
 - Our dataset was sourced from the Victorian Government located [HERE](https://discover.data.vic.gov.au/dataset/crash-stats-data-extract/resource/f9c7c05a-19e9-4593-aa2c-960a9c97b858)
 - The dataset spans 5 years of accident data throughout Victoria.
 - We focused on 4 of the CSVs in the dataset: "ACCIDENT", "NODE", "PERSON", and "VEHICLE. The raw CSV files for these can be found in the [Resources folder](https://github.com/amcl11/Project_3_Group_10/tree/main/Resources).
 - The files are as follows:

      - **ACCIDENT.CSV** - Basic accident details, time, severity, location <br>
        <br>
        *Note: severity is measured as follows: 1 = Fatal accident,  2 = Serious injury accident,  3 = Other injury accident, 4 = Non injury accident*
      
      - **PERSON.CSV** - Person based details, age, sex etc.
      
      - **VEHICLE.CSV** - Vehicle based data, vehicle type, make etc.
      
      - **NODE.CSV** - Includes accident Lat/Long references for mapping.

## Files:
 - "AU_Accidents.ipynb" - Importing raw CSV, data cleaning, database import.
 - "Flask_API.py" - Connection to database, API routes created for front-end data access.
 - "Index.html" ...
 - "Logic.js" ...
 - "Style.css" ...

