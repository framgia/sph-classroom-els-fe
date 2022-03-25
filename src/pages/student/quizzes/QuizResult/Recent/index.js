import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { BsClockHistory } from 'react-icons/bs';
import { PropTypes } from 'prop-types';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import QuestionApi from '../../../../../api/Question';
import QuizzesTakenReviewApi from '../../../../../api/QuizTakenReview';

import style from './index.module.scss';

const Recent = ({ relatedQuiz }) => {
  const [QuizzesRecentReview, setQuizzesRecentReview] = useState(null);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    QuizzesTakenReviewApi.getAll(relatedQuiz.id).then(({ data }) => {
      setQuizzesRecentReview(data.recentQuizzesTaken);
    });

    QuestionApi.getAll(relatedQuiz.id).then(({ data }) => {
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
        if (relatedQuiz.id === QuizRecent.quiz_id && score === -1) {
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
      return totalTimeLimit;
      
    }
  };

  return (
    <Col className={style.cardContainer}>
      {questions === null ? (
        <div className={style.loading}>
          <Spinner animation="border" role="status"></Spinner>
          <span className={style.loadingWord}>Loading</span>
        </div>
      ) : (
        <>
          {getTotalTimeLimit() === 0 ? (
            ''
          ) : (
            <Card className={style.card}>
              <Card.Header className={style.cardHeader}>
                <div className={style.cardTitle}>
                  <span className={style.titleHeader}>{relatedQuiz.title}</span>
                  <span className={style.clockHeader}>
                    <BsClockHistory size="15px" className={style.clockIcon} />
                    {getTotalTimeLimit()} secs
                  </span>
                </div>
              </Card.Header>
              <Card.Body className={style.cardBody}>
                <div className={style.quizInfo}>
                  <div className={style.quizResult}>
                    <p>Attempts</p>
                    <p>{QuizzesRecentReview?.length}</p>
                  </div>
                  <div className={style.quizResult}>
                    <p>Highest Score</p>
                    <p>
                      {getHighestScore()}/{questions?.length}
                    </p>
                  </div>
                  <div className={style.quizResult} style={{ fontWeight: 'bold' }}>
                    <p>Latest Score</p>
                    <p>
                      {getLatestScore() >= 0 ? getLatestScore() : 0}/
                      {questions?.length}
                    </p>
                  </div>
                </div>
              </Card.Body>

              <a 
                href={`/categories/${relatedQuiz.category_id}/quizzes/${relatedQuiz.id}/questions`}
                className={style.quizLink}
              >
                <div>Take Quiz</div>
              </a>
            </Card>
          )}
        </>
      )}
    </Col>
  );
};

Recent.propTypes = {
  relatedQuiz: PropTypes.object,
};


export default Recent;
