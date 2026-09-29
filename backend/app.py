from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "AI Employability System Backend is running!"
    })


@app.route("/api/assessment", methods=["POST"])
def assessment():
    data = request.get_json()

    dsa = data.get("dsa", 0)
    sql = data.get("sql", 0)
    aptitude = data.get("aptitude", 0)
    communication = data.get("communication", 0)

    employability_score = (
        dsa * 0.30 +
        sql * 0.25 +
        aptitude * 0.25 +
        communication * 0.20
    )

    weak_areas = []

    if dsa < 60:
        weak_areas.append("DSA")

    if sql < 60:
        weak_areas.append("SQL")

    if aptitude < 60:
        weak_areas.append("Aptitude")

    if communication < 60:
        weak_areas.append("Communication")

    recommendations = []

    if "DSA" in weak_areas:
        recommendations.append("Practice Arrays, Hashing and Two Pointer problems")

    if "SQL" in weak_areas:
        recommendations.append("Revise SQL Joins, GROUP BY and Window Functions")

    if "Aptitude" in weak_areas:
        recommendations.append("Practice Quantitative Aptitude and Logical Reasoning")

    if "Communication" in weak_areas:
        recommendations.append("Practice HR questions and technical explanations")

    return jsonify({
        "employability_score": round(employability_score, 2),
        "skill_scores": {
            "DSA": dsa,
            "SQL": sql,
            "Aptitude": aptitude,
            "Communication": communication
        },
        "weak_areas": weak_areas,
        "recommendations": recommendations
    })


if __name__ == "__main__":
    app.run(debug=True)