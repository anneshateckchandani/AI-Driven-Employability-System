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

    skill_scores = data.get("skill_scores", {})

    weak_areas = []
    recommendations = []

    recommendation_map = {
        "DSA": "Practice Arrays, Hashing, Two Pointer and Sliding Window problems.",
        "OOP": "Revise Encapsulation, Inheritance, Polymorphism and Abstraction.",
        "DBMS": "Revise Keys, Normalization, Joins and Transactions.",
        "Operating Systems":
            "Revise Processes, Threads, Scheduling and Memory Management.",
        "Computer Networks":
            "Revise TCP/IP, OSI Model, HTTP/HTTPS and Networking protocols.",
        "SQL":
            "Revise SQL Joins, GROUP BY, HAVING and Window Functions.",
        "Python":
            "Practice Python data structures, functions and Pandas.",
        "Statistics":
            "Revise Mean, Median, Mode, Probability and basic statistics.",
        "Aptitude":
            "Practice Percentages, Profit & Loss, Ratios and Logical Reasoning.",
        "Communication":
            "Practice explaining technical insights clearly to non-technical stakeholders.",
        "HTML/CSS":
            "Revise semantic HTML, CSS layouts, Flexbox and responsive design.",
        "JavaScript":
            "Revise variables, functions, arrays, objects and ES6 concepts.",
        "React":
            "Revise components, props, state, useState and useEffect.",
        "Web":
            "Revise HTTP, HTTPS, APIs and basic web architecture.",
        "ETL":
            "Revise Extract, Transform, Load and data pipeline concepts.",
        "Cloud":
            "Revise cloud storage, compute and basic AWS/Azure services.",
        "Big Data":
            "Revise Apache Spark, distributed processing and big-data concepts."
    }

    # Find weak areas
    for skill, score in skill_scores.items():

        if score < 70:
            weak_areas.append(skill)

            if skill in recommendation_map:
                recommendations.append(
                    recommendation_map[skill]
                )

    # Overall score
    if skill_scores:
        overall_score = round(
            sum(skill_scores.values()) / len(skill_scores)
        )
    else:
        overall_score = 0

    return jsonify({
        "employability_score": overall_score,
        "skill_scores": skill_scores,
        "weak_areas": weak_areas,
        "recommendations": recommendations
    })


if __name__ == "__main__":
    app.run(debug=True)