import { useState } from "react";
import "./App.css";

function App() {
  const [scores, setScores] = useState({
    dsa: "",
    sql: "",
    aptitude: "",
    communication: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setScores({
      ...scores,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dsa: Number(scores.dsa),
          sql: Number(scores.sql),
          aptitude: Number(scores.aptitude),
          communication: Number(scores.communication),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>AI-Driven Employability Assessment</h1>
        <p>
          Assess your skills and get a personalized placement preparation
          plan.
        </p>
      </header>

      <main>
        <section className="card">
          <h2>Employability Assessment</h2>

          <form onSubmit={handleSubmit}>
            <label>DSA Score</label>
            <input
              type="number"
              name="dsa"
              min="0"
              max="100"
              value={scores.dsa}
              onChange={handleChange}
              placeholder="Enter score out of 100"
              required
            />

            <label>SQL Score</label>
            <input
              type="number"
              name="sql"
              min="0"
              max="100"
              value={scores.sql}
              onChange={handleChange}
              placeholder="Enter score out of 100"
              required
            />

            <label>Aptitude Score</label>
            <input
              type="number"
              name="aptitude"
              min="0"
              max="100"
              value={scores.aptitude}
              onChange={handleChange}
              placeholder="Enter score out of 100"
              required
            />

            <label>Communication Score</label>
            <input
              type="number"
              name="communication"
              min="0"
              max="100"
              value={scores.communication}
              onChange={handleChange}
              placeholder="Enter score out of 100"
              required
            />

            <button type="submit">
              {loading ? "Analyzing..." : "Analyze Employability"}
            </button>
          </form>
        </section>

        {result && (
          <section className="result-card">
            <h2>Your Results</h2>

            <div className="score">
              {result.employability_score}%
            </div>

            <h3>Skill Scores</h3>

            <div className="skills">
              <p>DSA: {result.skill_scores.DSA}%</p>
              <p>SQL: {result.skill_scores.SQL}%</p>
              <p>Aptitude: {result.skill_scores.Aptitude}%</p>
              <p>
                Communication: {result.skill_scores.Communication}%
              </p>
            </div>

            <h3>Areas to Improve</h3>

            {result.weak_areas.length > 0 ? (
              <ul>
                {result.weak_areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            ) : (
              <p>No major weak areas identified.</p>
            )}

            <h3>Personalized Recommendations</h3>

            {result.recommendations.length > 0 ? (
              <ul>
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p>Keep practicing to maintain your performance.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;