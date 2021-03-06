import React, { useState, useContext, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import Button from '../../../../components/Button';
import QuizAnswerResult from './QuizAnswerResult';
import Recent from '../QuizResult/Recent/index';
import FriendsScoreApi from '../../../../api/FriendsScore';
import AnswerApi from '../../../../api/Answer';
import QuizApi from '../../../../api/Quiz';
import style from './index.module.scss';
import Spinner from 'react-bootstrap/Spinner';

import { QuestionsContext } from '../QuestionList';

const QuizResult = ({
  hideQuizResult = null,
  forProfile = false,
  quizTakenID = null,
  title = null,
  questions,
  score,
  total,
  quizId,
  categoryId
}) => {
  const [viewResults, setViewResults] = useState(false);
  const quizInfo = useContext(QuestionsContext);
  const [answers, setAnswers] = useState(null);
  const [friendsScore, setFriendsScore] = useState(null);
  const [quizRelated, setQuizRelated] = useState(null);
  const passing = total / 2;

  useEffect(() => {
    AnswerApi.getAll(quizTakenID || quizInfo.quizTakenId).then(({ data }) => {
      setAnswers(data.data);
    });

    FriendsScoreApi.getAll(quizId).then(({ data }) => {
      setFriendsScore(data.data);
    });

    QuizApi.getRelatedQuizzes(categoryId, quizId).then(({ data }) => {
      setQuizRelated(data.relatedQuizzes);
    });
  }, []);

  const viewResultsPage = () => {
    setViewResults(!viewResults);
  };

  const retakeButton = () => {
    if (score < passing) {
      return (
        <a href={`/categories/${categoryId}/quizzes/${quizId}/questions`}>
          <Button buttonLabel="Retake Quiz" buttonSize="def" />
        </a>
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      {viewResults == false ? (
        <Container className={style.card}>
          <div className="d-flex justify-content-center align-items-center">
            <Card>
              <div className={style.resultTopic}>
                {forProfile ? (
                  <BsFillArrowLeftSquareFill
                    onClick={hideQuizResult}
                    className={style.backButton}
                  />
                ) : (
                  ''
                )}
                <center className={style.toTruncate}>
                  {title || quizInfo.title}
                </center>
              </div>
              <Card.Body className={style.resultWholeBodyCard}>
                <div className={style.resultUpperBodyCard}>
                  <div className={style.resultCardLeft}>
                    <div className={style.resultScoreDisplay}>
                      {score < passing ? (
                        <>
                          <div className={style.resultQuizPraise}>
                            Better Luck Next Time!
                          </div>
                          <div className={style.resultQuizRemarks}>
                            You Failed
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={style.resultQuizPraise}>
                            Great Job!
                          </div>
                          <div className={style.resultQuizRemarks}>
                            You Passed
                          </div>
                        </>
                      )}
                      <Card.Text className={style.resultScore}>
                        <span
                          className={
                            score < passing ? `${style.fail}` : `${style.pass}`
                          }
                        >
                          <b>{score}</b>
                        </span>
                        <b>/{total}</b>
                      </Card.Text>
                    </div>
                  </div>
                  {friendsScore?.length > 0 ? (
                    <Card className={style.friendsScoreCard}>
                      <Card.Header className={style.friendsScoreHeader}>
                        <div className={style.friendScoreText}>
                          Friend&apos;s Score
                        </div>
                        <hr className={style.divider} />
                      </Card.Header>
                      <Card.Body className={style.friendsScoreCardBody}>
                        {friendsScore?.map((friendScore, idx) => {
                          return (
                            <div key={idx}>
                              <Link
                                to={`/students/${friendScore.id}`}
                                className={style.friendsScoreInfo}
                              >
                                <div>
                                  <img
                                    className={style.friendsAvatar}
                                    alt="avatar"
                                    src={
                                      friendScore.avatar
                                        ? friendScore.avatar_url
                                        : 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png'
                                    }
                                  />
                                </div>

                                <div className={style.friendsName}>
                                  {friendScore.name}
                                </div>

                                <div className={style.friendsScore}>
                                  {friendScore.score}/{total}
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </Card.Body>
                    </Card>
                  ) : (
                    ''
                  )}
                </div>
                <hr />
                <div className={style.resultsButtons}>
                  <Button
                    buttonLabel="View Result"
                    buttonSize="def"
                    onClick={() => viewResultsPage()}
                  />
                  {retakeButton()}
                </div>
              </Card.Body>
            </Card>
          </div>
          <footer>
            <h2 className={style.relatedQuizzesText}>Related Quizzes</h2>
            {quizRelated?.length === 0 ? (
              <div className={style.messageContainer}>
                <center>
                  <span>No Related Quizzes</span>
                </center>
              </div>
            ) : !quizRelated ? (
              <div className={style.spinner}>
                <Spinner animation="border" role="status"></Spinner>
                <span>Loading</span>
              </div>
            ) : (
              <div className={style.relatedQuizzes}>
                {quizRelated?.map((relatedQuiz, idx) => {
                  return <Recent relatedQuiz={relatedQuiz} key={idx} />;
                })}
              </div>
            )}
          </footer>
        </Container>
      ) : answers ? (
        <QuizAnswerResult
          viewResultsPage={viewResultsPage}
          title={title}
          quizQuestions={questions}
          answers={answers}
          score={score}
          total={total}
          quizId={quizId}
          categoryId={categoryId}
        />
      ) : (
        ''
      )}
    </div>
  );
};

QuizResult.propTypes = {
  hideQuizResult: PropTypes.func,
  forProfile: PropTypes.bool,
  quizTakenID: PropTypes.number,
  title: PropTypes.string,
  questions: PropTypes.array,
  score: PropTypes.number,
  total: PropTypes.number,
  quizId: PropTypes.number,
  categoryId: PropTypes.number,
};

export default QuizResult;
