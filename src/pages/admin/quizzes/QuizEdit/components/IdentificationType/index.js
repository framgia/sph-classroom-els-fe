import React, { Fragment, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PropTypes } from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputField from '../../../../../../components/InputField';

import style from '../../index.module.scss';

const IdentificationType = ({ question, getData }) => {
  const { control } = useForm();
  const [questionUpdated, setQuestionUpdated] = useState(false);
  const [questionOnChange, setQuestionOnChange] = useState({
    question: question.question,
    answer: question.text_answer,
    questionId: question.id
  });

  useEffect(() => {
    setQuestionOnChange({
      ...questionOnChange,
      question: question.question,
      answer: question.text_answer,
      questionId: question.id
    });
  }, [question]);

  const handleChangeQuestion = (e) => {
    setQuestionOnChange({
      ...questionOnChange,
      question: e.target.value
    });
    setQuestionUpdated(true);
  };

  useEffect(() => {
    if (questionUpdated) {
      getData(questionOnChange);
      setQuestionUpdated(false);
    }
  }, [questionUpdated]);

  const handleChangeAnswer = (e) => {
    setQuestionOnChange({
      ...questionOnChange,
      answer: e.target.value
    });
    setQuestionUpdated(true);
  };

  return (
    <Fragment>
      <div>
        <Form>
          <Form.Label className={style.inputTitle}>Question</Form.Label>
          <Controller
            control={control}
            name="question"
            defaultValue={question.question}
            render={({ field: { ref } }) => (
              <InputField
                type="text"
                inputStyle={style.inputWidth}
                onChange={handleChangeQuestion}
                value={questionOnChange.question}
                ref={ref}
              />
            )}
          />
        </Form>
      </div>
      <div className={style.formSpacing}>
        <Form.Label className={style.inputTitle}>Answer</Form.Label>
        <Controller
          control={control}
          name="text_answer"
          defaultValue={question.text_answer}
          render={({ field: { ref } }) => (
            <InputField
              as="textarea"
              inputStyle={style.inputHeight}
              onChange={handleChangeAnswer}
              value={questionOnChange.answer}
              ref={ref}
            />
          )}
        />
      </div>
    </Fragment>
  );
};

IdentificationType.propTypes = {
  question: PropTypes.object,
  getData: PropTypes.func
};

export default IdentificationType;
