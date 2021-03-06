import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { BsClockHistory } from 'react-icons/bs';

import style from './index.module.scss';
import QuizzesTakenReviewApi from '../../../../../../api/QuizTakenReview';
import QuestionApi from '../../../../../../api/Question';

const QuestionGrid = ({ quiz }) => {
  const [QuizzesRecentReview, setQuizzesRecentReview] = useState(null);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    QuizzesTakenReviewApi.getAll(quiz.id).then(({ data }) => {
      setQuizzesRecentReview(data.recentQuizzesTaken);
    });

    QuestionApi.getAll(quiz.id).then(({ data }) => {
      setQuestions(data.data);
    });
  }, []);

  const getHighestScore = () => {
    if (QuizzesRecentReview?.length > 0) {
      const highestScore = QuizzesRecentReview.reduce((prev, current) => {
        return prev.score > current.score ? prev : current;
      });

      return highestScore.score;
    }

    return 0;
  };

  const getLatestScore = () => {
    let score = -1;
    if (QuizzesRecentReview?.length > 0) {
      QuizzesRecentReview?.forEach((QuizRecent) => {
        if (quiz.id === QuizRecent.quiz_id && score === -1) {
          score = QuizRecent.score;
        }
      });

      return score;
    }
  };

  const getTotalTimeLimit = () => {
    if (questions != null) {
      const totalTimeLimit = questions.reduce((total, questions) => {
        return (total += questions.time_limit);
      }, 0);

      if (totalTimeLimit >= 60) {
        const mins = totalTimeLimit / 60;
        const secs = totalTimeLimit % 60;

        return secs > 0
          ? `${parseInt(mins)} min/s and ${secs} secs`
          : `${parseInt(mins)} min/s`;
      } else {
        return `${totalTimeLimit} secs`;
      }
    }
  };

  return (
    <Card>
      <Card.Header className={style.card}>
        <div className={style.cardTitle}>
          <div className={style.toTruncate}>{quiz?.title}</div>
          <div className={style.timeStyle}>
            <BsClockHistory size="15px" />
            {getTotalTimeLimit()}
          </div>
        </div>
      </Card.Header>
      <Card.Body className={style.card02}>
        <div className={style.ResultscoreCardText}>
          <div className={style.ResultScore}>
            <p>Attempts</p>
            <p>{QuizzesRecentReview?.length}</p>
          </div>
          <div className={style.ResultScore}>
            <p>Highest Score</p>
            <p>
              {getHighestScore()}/{questions?.length}
            </p>
          </div>
          <div className={style.ResultScore} style={{ fontWeight: 'bold' }}>
            <p>Latest Score</p>
            <p>
              {getLatestScore() >= 0 ? getLatestScore() : 0}/{questions?.length}
            </p>
          </div>
        </div>
      </Card.Body>
      {quiz.answerCount === 0 || (
        <div className={style.repeatDiv}>Take Quiz</div>
      )}
    </Card>
  );
};

QuestionGrid.propTypes = {
  quiz: PropTypes.object
};

export default QuestionGrid;
