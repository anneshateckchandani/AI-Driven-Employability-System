import { useState } from "react";
import questions from "./questions.json";
import "./App.css";

function App() {
  const [selectedRole, setSelectedRole] = useState("");
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const roles = [
    {
      name: "Software Developer",
      description: "DSA, OOP, DBMS, OS and Computer Networks",
      icon: "💻",
    },
    {
      name: "Data Analyst",
      description: "SQL, Python, Statistics, Aptitude and Communication",
      icon: "📊",
    },
    {
      name: "Data Engineer",
      description: "SQL, Python, ETL, Cloud and Big Data",
      icon: "🏗️",
    },
    {
      name: "Frontend Developer",
      description: "HTML, CSS, JavaScript, React and Web",
      icon: "🎨",
    },
  ];

  const roleQuestions = questions.filter(
    (question) => question.role === selectedRole
  );

  const startAssessment = () => {
    if (!selectedRole) {
      alert("Please select a target role first.");
      return;
    }

    setAssessmentStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setResult(null);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    const updatedAnswers = [...answers, selectedAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestion < roleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      calculateResult(updatedAnswers);
    }
  };

const calculateResult = async (finalAnswers) => {
  let correct = 0;

  const skillStats = {};

  roleQuestions.forEach((question, index) => {
    const userAnswer = finalAnswers[index];
    const correctAnswer = question.options[question.answer];

    if (!skillStats[question.skill]) {
      skillStats[question.skill] = {
        correct: 0,
        total: 0,
      };
    }

    skillStats[question.skill].total++;

    if (userAnswer === correctAnswer) {
      correct++;
      skillStats[question.skill].correct++;
    }
  });

  const overallScore = Math.round(
    (correct / roleQuestions.length) * 100
  );

  const skillScores = {};

  Object.keys(skillStats).forEach((skill) => {
    skillScores[skill] = Math.round(
      (skillStats[skill].correct /
        skillStats[skill].total) *
        100
    );
  });

  try {
    const response = await fetch(
      "http://127.0.0.1:5000/api/assessment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill_scores: skillScores,
        }),
      }
    );

    const backendResult = await response.json();

    setResult({
      score: backendResult.employability_score,
      correct,
      total: roleQuestions.length,
      skillScores: backendResult.skill_scores,
      weakAreas: backendResult.weak_areas,
      recommendations: backendResult.recommendations,
    });

    setAssessmentStarted(false);

  } catch (error) {

    console.error("Backend connection error:", error);

    alert(
      "Backend server is not running. Please start Flask backend."
    );
  }
};

  const retakeAssessment = () => {
    setResult(null);
    setAssessmentStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
  };

  // -------------------------------
  // RESULT SCREEN
  // -------------------------------

  if (result) {
    return (
      <div className="app">
        <header>
          <h1>Assessment Results</h1>
          <p>{selectedRole} Employability Assessment</p>
        </header>

        <main>
          <section className="result-card">

            <div className="score-circle">
              <span>{result.score}%</span>
              <small>Overall Score</small>
            </div>

            <h2>Your Employability Report</h2>

            <p className="result-summary">
              You answered {result.correct} out of {result.total} questions
              correctly.
            </p>

            <h3>Skill Performance</h3>

            <div className="skill-results">
              {Object.entries(result.skillScores).map(
                ([skill, score]) => (
                  <div className="skill-result" key={skill}>
                    <div className="skill-header">
                      <span>{skill}</span>
                      <strong>{score}%</strong>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>

            <h3>Areas to Improve</h3>

            {result.weakAreas.length > 0 ? (
              <div className="weak-areas">
                {result.weakAreas.map((skill) => (
                  <span key={skill} className="weak-badge">
                    ⚠ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="success-message">
                🎉 No major weak areas identified!
              </p>
            )}

            <h3>Personalized Recommendations</h3>

            <div className="recommendations">
              {result.recommendations.length > 0 ? (
                result.recommendations.map((recommendation, index) => (
                  <div className="recommendation" key={index}>
                    <span>📚</span>
                    <p>{recommendation}</p>
                  </div>
                ))
              ) : (
                <p>
                  Keep practicing consistently and maintain your current
                  performance.
                </p>
              )}
            </div>

            <div className="result-buttons">
              <button onClick={retakeAssessment}>
                Retake Assessment
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  setResult(null);
                  setSelectedRole("");
                }}
              >
                Choose Another Role
              </button>
            </div>

          </section>
        </main>
      </div>
    );
  }

  // -------------------------------
  // ASSESSMENT SCREEN
  // -------------------------------

  if (assessmentStarted) {
    const question = roleQuestions[currentQuestion];

    return (
      <div className="app">
        <header>
          <h1>{selectedRole} Assessment</h1>
          <p>Test your skills and identify your preparation gaps.</p>
        </header>

        <main>
          <section className="assessment-card">

            <div className="progress">
              Question {currentQuestion + 1} of {roleQuestions.length}
            </div>

            <div className="question-skill">
              Skill: {question.skill}
            </div>

            <h2>{question.question}</h2>

            <div className="options">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${
                    selectedAnswer === option
                      ? "option-selected"
                      : ""
                  }`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => setSelectedAnswer(option)}
                  />

                  <span>{option}</span>
                </div>
              ))}
            </div>

            <button onClick={handleNext}>
              {currentQuestion === roleQuestions.length - 1
                ? "Submit Assessment"
                : "Next Question →"}
            </button>

          </section>
        </main>
      </div>
    );
  }

  // -------------------------------
  // ROLE SELECTION SCREEN
  // -------------------------------

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
        <section className="welcome-card">

          <h2>Select Your Target Role</h2>

          <p>
            Choose the role you are preparing for. Your assessment will be
            customized according to the selected role.
          </p>

          <div className="role-grid">

            {roles.map((role) => (
              <div
                key={role.name}
                className={`role-card ${
                  selectedRole === role.name ? "selected" : ""
                }`}
                onClick={() => setSelectedRole(role.name)}
              >
                <div className="role-icon">{role.icon}</div>

                <h3>{role.name}</h3>

                <p>{role.description}</p>

                <input
                  type="radio"
                  checked={selectedRole === role.name}
                  onChange={() => setSelectedRole(role.name)}
                />
              </div>
            ))}

          </div>

          <button onClick={startAssessment}>
            Start Assessment
          </button>

        </section>
      </main>
    </div>
  );
}

export default App;