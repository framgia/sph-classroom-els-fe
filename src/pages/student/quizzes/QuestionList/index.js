import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import style from './index.module.css';
import QuestionAnswer from './QuestionAnswer';

import QuizApi from '../../../../api/Quiz';
import QuestionApi from '../../../../api/Question';

export const QuestionsContext = React.createContext();

const QuestionList = () => {
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const { categoryId, quizId } = useParams();

  useEffect(() => {
    QuizApi.show({ categoryId, quizId }).then(({data}) => {
      setQuizInfo(data.data);
    });

    QuestionApi.getAll(quizId).then(({data}) => {
      setQuestions(data.data);
    });
  }, []);

  const getTotalTimeLimit = () => {
    if(questions != null){
      let total = 0;

      for(let x = 0; x < questions.length; x++) {
        total += questions[x].time_limit;
      }

      return total;
    }
  };

  const showQuestions = () => {
    setShowQuestionnaire(!showQuestionnaire);
  };

  return (
    <div id={style.center}>
      <Container>
        <QuestionsContext.Provider value={{questions, title: quizInfo?.title}}>
          {showQuestionnaire ? '' : 
            <>
              <Button href={`/categories/${categoryId}/quizzes`} id={style.backbutton}>BACK</Button>
              <Card>
                <Card.Header id={style.topicbg} className={style.cardheader}>
                  <div >
                    <h2 className={style.topic}><b>Topic:</b> {quizInfo?.title} </h2>
                  </div>
                </Card.Header>
                <Card.Body className={style.wholebodycard}>
                  <div className={style.headerquiz}> {quizInfo?.title} </div>
                  <div align="center" id={style.overview}>
                    <p>This quiz consist of { questions?.length } items</p>
                    <hr />
                    <p> Overall Time: {getTotalTimeLimit()} seconds </p>
                  </div>
                  <hr className={style.hbreakbottom} />
                  <div className={style.bottombodycard}>
                    <Button onClick={() => showQuestions()}  id={style.button} className={style.startbutton}>Start Quiz</Button>
                  </div>
                </Card.Body>
              </Card> </>}
          {questions && showQuestionnaire ? <QuestionAnswer /> : ''}
        </QuestionsContext.Provider>
      </Container>
    </div>
  );
};

export default QuestionList;