# Import necessary modules
from flask import Flask, jsonify, request
from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

# Initialise Flask application
app = Flask(__name__)

# Define the database engine
engine = create_engine('sqlite:///vic_accidents.db')

# Define a base class using SQLAlchemy's declarative_base
Base = declarative_base()

# Define the Accident class
class Accident(Base):
    __tablename__ = 'accidents'
    
    ACCIDENT_NO = Column(String, primary_key=True)
    ACCIDENT_DATE = Column(String)
    ACCIDENT_TYPE_DESC = Column(String)
    DAY_WEEK_DESC = Column(String)
    SEVERITY = Column(Integer)
    NODE_ID = Column(Integer)
    SEX = Column(String)
    AGE_GROUP = Column(String)
    LAT = Column(Float)
    LONG = Column(Float)
    LGA_NAME = Column(String)
    ACCIDENT_POSTCODE = Column(String)
    VEHICLE_BODY_STYLE = Column(String)
    VEHICLE_MAKE = Column(String)
    VEHICLE_TYPE = Column(Float)
    VEHICLE_POWER = Column(String)
    OWNER_POSTCODE = Column(Integer)
    VEHICLE_YEAR_MANUF = Column(Integer)

# Create the table structure based on the above class
Base.metadata.create_all(engine)

# Define a function to create a GeoJSON feature from an Accident object
def create_geojson_feature(accident):
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [accident.LONG, accident.LAT]
        },
        "properties": {
            "Accident No": accident.ACCIDENT_NO,
            "LGA Name": accident.LGA_NAME,
            "Accident Severity": accident.SEVERITY,
            "Accident Postcode": accident.ACCIDENT_POSTCODE
        }
    }

# Define the default route, serving GeoJSON data of accident locations
@app.route("/")
def accident_locations():
    
    # Establish a connection to the SQLite database
    session = Session(engine)
    
    # Get query parameters from the request
    severity_filter = request.args.get('severity', default=None, type=int)
    
    # Create an empty list to store GeoJSON features
    geojson_features = []

    # Query the database for accidents and convert them to GeoJSON features
    # Apply the severity filter to the query (if requested)
    if severity_filter is not None:
        for accident in session.query(Accident).filter(Accident.SEVERITY == severity_filter).all():
            feature = create_geojson_feature(accident)
            geojson_features.append(feature)
    else:
        for accident in session.query(Accident).all():
            feature = create_geojson_feature(accident)
            geojson_features.append(feature)
    # Wrap the features in a GeoJSON object
    geojson_object = {
        "type": "FeatureCollection",
        "features": geojson_features
    }    
    
    # Close the database session and return the GeoJSON object as JSON response
    session.close()
    return jsonify(geojson_object)

# Define the PERSON route, serving PERSON INFO data
@app.route("/person_info")
def person_info(): 

    # Establish a connection to the SQLite database
    session = Session(engine)

    # Query database for relevant fields 
    person_results = session.query(
        Accident.ACCIDENT_NO,
        Accident.AGE_GROUP,
        Accident.SEX,
        Accident.OWNER_POSTCODE
    ).all()
    
    # close the database session
    session.close()
    
    # Create a list of dictionaries for the JSON response
    # Needs to include Accident_No, Age_Group, Sex, Owner_Postcode
    person_info = []
    
    for result in person_results:
        accident_no, age_group, sex, owner_postcode = result
        person_info.append({
            "Accident No": accident_no,
            "Age Group": age_group,
            "Gender": sex,
            "Owner's Postcode": owner_postcode
        })

    return jsonify(person_info)

@app.route("/vehicle_info")
def vehicle_info():
    
    # Establish a connection to the SQLite database
    session = Session(engine)
    
    # Retrieve relevant fields from the database
    vehicle_results = session.query(
        Accident.ACCIDENT_NO,
        Accident.VEHICLE_YEAR_MANUF,
        Accident.VEHICLE_POWER,
        Accident.VEHICLE_MAKE,
        Accident.VEHICLE_BODY_STYLE
    ).all()
    
    session.close()
    
    vehicle_info = []
    
    for result in vehicle_results:
        accident_no, vehicle_year_manuf, vehicle_power, vehicle_make, vehicle_body_style = result
    
        vehicle_info.append({
            "Accident No": accident_no,
            "Vehicle Year Manufactured": vehicle_year_manuf,
            "Vehicle Power": vehicle_power,
            "Vehicle Make": vehicle_make,
            "Vehicle Body Style": vehicle_body_style
            
        })
    
    return jsonify(vehicle_info)    

# Start the Flask application   
if __name__ == '__main__':
    app.run(debug=True)

