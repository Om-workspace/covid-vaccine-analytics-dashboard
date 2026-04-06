from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# ---------------- LOAD DATASET ----------------

BASE_DIR = os.path.dirname(__file__)
DATASET = os.path.join(BASE_DIR, '..', 'dataset', 'covid_vaccine_hybrid_statewise.csv')
df = pd.read_csv(DATASET, skip_blank_lines=True)
df = df.dropna(how='all')
df = df.fillna(0)

# ---------------- DOSE APIs ----------------

@app.route('/first-dose')
def first_dose():
    data = df.groupby('State')['First Dose'].sum().to_dict()
    return jsonify(data)

@app.route('/second-dose')
def second_dose():
    data = df.groupby('State')['Second Dose'].sum().to_dict()
    return jsonify(data)

@app.route('/total-dose')
def total_dose():
    data = df.groupby('State')['Total Doses'].sum().to_dict()
    return jsonify(data)

@app.route('/latest')
def latest():
    summary = df.groupby('State').agg({
        'First Dose': 'sum',
        'Second Dose': 'sum',
        'Total Doses': 'sum'
    }).reset_index()

    result = summary.to_dict(orient='records')
    return jsonify({"data": result})

# ---------------- VACCINE & GENDER APIs ----------------

@app.route('/vaccines')
def vaccines():
    data = df.groupby(['State', 'Vaccine'])['Total Doses'].sum().reset_index()
    return jsonify(data.to_dict(orient='records'))

@app.route('/by-vaccine/<vaccine>')
def by_vaccine(vaccine):
    filtered = df[df['Vaccine'].str.lower() == vaccine.lower()]
    data = filtered.groupby('State')['Total Doses'].sum().to_dict()
    return jsonify(data)

@app.route('/gender')
def gender():
    female = int(df['Female Vaccinated'].sum())
    male = int(df['Male Vaccinated'].sum())
    return jsonify({"female": female, "male": male})

@app.route('/state/<state>')
def state_data(state):
    filtered = df[df['State'].str.lower() == state.lower()]
    return jsonify(filtered.to_dict(orient='records'))

# ---------------- COMMON API ----------------

@app.route('/states')
def states():
    states_list = sorted(df['State'].unique().tolist())
    return jsonify(states_list)

# ---------------- RUN ----------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)