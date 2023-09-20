# Import necessary modules
from flask import Flask, jsonify, request, render_template
import sqlite3

# Initialize Flask application
app = Flask(__name__)

# Function to create a GeoJSON feature
def create_geojson_feature(accident):
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [accident["LONG"], accident["LAT"]]
        },
        "properties": {
            "Accident No": accident["ACCIDENT_NO"],
            "LGA Name": accident["LGA_NAME"],
            "Accident Severity": accident["SEVERITY"],
            "Accident Postcode": accident["ACCIDENT_POSTCODE"]
        }
    }

# Home route
@app.route('/')
def home():
    return render_template('index.html')

@app.route("/all_accidents")
def accident_locations():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    severity_filter = request.args.get('severity', default=None, type=int)
    if severity_filter is not None:
        cursor.execute("SELECT * FROM accidents WHERE SEVERITY=?", (severity_filter,))
    else:
        cursor.execute("SELECT * FROM accidents")

    rows = cursor.fetchall()
    conn.close()

    geojson_features = [create_geojson_feature({col[0]: row[idx] for idx, col in enumerate(cursor.description)}) for row in rows]

    geojson_object = {
        "type": "FeatureCollection",
        "features": geojson_features
    }

    return jsonify(geojson_object)



@app.route("/accidents_by_LGA")
def accidents_by_lga():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    # Total Accidents by LGA
    cursor.execute("SELECT LGA_NAME,COUNT(ACCIDENT_NO) FROM accidents GROUP BY LGA_NAME")
    total_accidents_result = cursor.fetchall()

    # SQL query for the Worst Postcode per LGA
    worst_postcode_sql_query = '''
    SELECT LGA_NAME, ACCIDENT_POSTCODE, COUNT(*) as num_accidents
    FROM accidents
    GROUP BY LGA_NAME, ACCIDENT_POSTCODE
    ORDER BY LGA_NAME, num_accidents DESC
    '''
    cursor.execute(worst_postcode_sql_query)
    worst_postcode_result = cursor.fetchall()

    conn.close()

    total_accidents_dict = {lga: count for lga, count in total_accidents_result}
    worst_postcode_dict = {}
    for lga, postcode, _ in worst_postcode_result:
        if lga not in worst_postcode_dict:
            worst_postcode_dict[lga] = postcode

    lga_details = [
        {
            "LGA Name": lga.replace("(", "").replace(")", ""),
            "Total LGA Accidents": total_accidents_dict.get(lga, 0),
            "Postcode with highest no. accidents": worst_postcode_dict.get(lga, "N/A")
        }
        for lga in total_accidents_dict.keys()
    ]

    return jsonify(lga_details)

@app.route("/person_info")
def person_info():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT ACCIDENT_NO, AGE_GROUP, SEX, OWNER_POSTCODE FROM accidents")
    person_results = cursor.fetchall()

    conn.close()

    person_info = [
        {
            "Accident No": accident_no,
            "Age Group": age_group,
            "Gender": sex,
            "Owner's Postcode": owner_postcode
        }
        for accident_no, age_group, sex, owner_postcode in person_results
    ]

    return jsonify(person_info)

@app.route("/vehicle_info")
def vehicle_info():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT ACCIDENT_NO, VEHICLE_YEAR_MANUF, VEHICLE_POWER, VEHICLE_MAKE, VEHICLE_BODY_STYLE FROM accidents")
    vehicle_results = cursor.fetchall()

    conn.close()

    vehicle_info = [
        {
            "Accident No": accident_no,
            "Vehicle Year Manufactured": vehicle_year_manuf,
            "Vehicle Power": vehicle_power,
            "Vehicle Make": vehicle_make,
            "Vehicle Body Style": vehicle_body_style
        }
        for accident_no, vehicle_year_manuf, vehicle_power, vehicle_make, vehicle_body_style in vehicle_results
    ]

    return jsonify(vehicle_info)

@app.route('/total_accidents_by_make', methods=['GET'])
def total_accidents_by_make():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()
    by_make = {}
    cursor.execute("SELECT vehicle_make, COUNT(*) FROM accidents GROUP BY vehicle_make")
    for row in cursor.fetchall():
        by_make[row[0]] = row[1]
    conn.close()
    return jsonify({'byMake': by_make})

@app.route('/total_accidents_by_manufacture_year', methods=['GET'])
def total_accidents_by_year():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()
    by_year = {}
    cursor.execute("SELECT vehicle_year_manuf, COUNT(*) FROM accidents GROUP BY vehicle_year_manuf")
    for row in cursor.fetchall():
        by_year[row[0]] = row[1]
    conn.close()
    return jsonify({'byYear': by_year})

@app.route('/total_accidents_by_power', methods=['GET'])
def total_accidents_by_power():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()
    by_power = {}
    cursor.execute("SELECT vehicle_power, COUNT(*) FROM accidents GROUP BY vehicle_power")
    for row in cursor.fetchall():
        by_power[row[0]] = row[1]
    conn.close()
    return jsonify({'byPower': by_power})

@app.route('/total_accidents_by_body_style', methods=['GET'])
def total_accidents_by_body_style():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()
    by_body_style = {}
    cursor.execute("SELECT vehicle_body_style, COUNT(*) FROM accidents GROUP BY vehicle_body_style")
    for row in cursor.fetchall():
        by_body_style[row[0]] = row[1]
    conn.close()
    return jsonify({'byBodyStyle': by_body_style})

@app.route("/accidents_by_age_group")
def accidents_by_age_group():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    # Query to get total accident count grouped by age group, excluding unwanted age groups
    cursor.execute("SELECT AGE_GROUP, COUNT(ACCIDENT_NO) FROM accidents WHERE AGE_GROUP NOT IN ('0-4', '13-15') GROUP BY AGE_GROUP")
    age_group_results = cursor.fetchall()

    conn.close()

    # Create the response
    age_group_info = [
        {
            "Age Group": age_group,
            "Total Accidents": count
        }
        for age_group, count in age_group_results
    ]

    return jsonify(age_group_info)

@app.route("/accidents_by_year")
def accidents_by_year():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    # Query to get total accident count grouped by accident year
    cursor.execute("SELECT ACCIDENT_YEAR, COUNT(ACCIDENT_NO) FROM accidents GROUP BY ACCIDENT_YEAR")
    year_results = cursor.fetchall()

    conn.close()

    # Create the response
    year_info = [
        {
            "Accident Year": year,
            "Total Accidents": count
        }
        for year, count in year_results
    ]

    return jsonify(year_info)

@app.route("/accidents_by_gender")
def accidents_by_gender():
    conn = sqlite3.connect('vic_accidents.sqlite')
    cursor = conn.cursor()

    # Query to get total accident count grouped by Gender
    cursor.execute("SELECT SEX, COUNT(ACCIDENT_NO) FROM accidents GROUP BY SEX")
    gender_results = cursor.fetchall()

    conn.close()

    # Create the response
    gender_info = [
        {
            "Gender": gender,
            "Total Accidents": count
        }
        for gender, count in gender_results
    ]

    return jsonify(gender_info)


# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)