import React from 'react';
import '../components/Quiz.css';

const Home = ({ onStart }) => {
  return (
    <div className="home-page">
      <div className="quiz-header">
        <div className="quiz-icon">?</div>
        <div className="quiz-title-bubbles">
          <span className="bubble bubble-yellow">T</span>
          <span className="bubble bubble-green">R</span>
          <span className="bubble bubble-blue">I</span>
          <span className="bubble bubble-orange">V</span>
          <span className="bubble bubble-purple">I</span>
          <span className="bubble bubble-red">A</span>
        </div>
        <div className="quiz-title-under">TIME</div>
      </div>
      <button className="start-quiz-btn" onClick={onStart}>Start Quiz</button>
    </div>
  );
};

export default Home;

