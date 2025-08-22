import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timeUp, setTimeUp] = useState(false);

  const currentQuestionNumber = currentQuestionIndex + 1;
  const totalQuestions = quizData.length;

  useEffect(() => {
    fetch('https://the-trivia-api.com/api/questions?limit=10')
      .then((response) => response.json())
      .then((data) => {
        // Mappa om data till quiz-formatet som används i appen
        const mapped = data.map(q => ({
          question: q.question,
          options: shuffleArray([q.correctAnswer, ...q.incorrectAnswers]),
          answer: q.correctAnswer
        }));
        setQuizData(mapped);
      })
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, []);
// Hjälpfunktion för att blanda alternativen
function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

  useEffect(() => {
    if (isConfirmed || timeUp) return;
    setTimeLeft(20);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          setIsConfirmed(true);
          setTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, totalQuestions, isConfirmed, timeUp]);

  const handleOptionClick = (option) => {
    if (!timeUp) {
      setSelectedOption(option);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption) {
      if (selectedOption === quizData[currentQuestionIndex]?.answer) {
        setScore(score + 1);
      }
      setIsConfirmed(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsConfirmed(false);
      setSelectedOption(null);
      setTimeUp(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(20);
    setTimeUp(false);
  };

  if (quizData.length === 0) {
    return <div>Laddar frågor...</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex] || {};

  if (quizFinished) {
    return (
      <div className="quiz-result">
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
        <h2 className="quiz-result-title">Quiz Result</h2>
        <p className="quiz-result-score">
          You scored <span className="current-question-number">{score}</span> out of <span className="total-question-number">{totalQuestions}</span>
        </p>
        <button className="start-quiz-btn" onClick={handleRestartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  // Bokstäver för alternativen
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="quiz-container new-quiz-structure">
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
      <div className="quiz-status-row">
        <div className="question-tracker">
          Question <span className="current-question-number">{currentQuestionNumber}</span> out of <span className="total-question-number">{totalQuestions}</span>
        </div>
      </div>
      <div className="question-bg">
        <div className="question-text">{currentQuestion.question}</div>
      </div>

      <div className="options-grid">
        {currentQuestion.options?.map((option, index) => {
          const isCorrect = isConfirmed && option === currentQuestion.answer;
          const isWrong = isConfirmed && selectedOption === option && option !== currentQuestion.answer;
          return (
            <div
              key={index}
              onClick={() => !isConfirmed && !timeUp && handleOptionClick(option)}
              className={`option-block ${selectedOption === option ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
            >
              <span className="option-label">{optionLabels[index] || ''}:</span> {option}
            </div>
          );
        })}
      </div>

      <div className="confirm-timer-block">
        {(!isConfirmed && !timeUp) ? (
          <>
            <button
              onClick={handleConfirmAnswer}
              disabled={!selectedOption}
            >
              Confirm Answer
            </button>
            <div className={`timer timer-below${timeLeft < 10 ? ' danger' : ''}`}>{timeLeft} seconds left</div>
          </>
        ) : (
          <button onClick={handleNextQuestion}>
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;

