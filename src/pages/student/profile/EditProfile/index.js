import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import style from './index.module.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';

import ProfileEditApi from '../../../../api/ProfileEdit';
import StudentsApi from '../../../../api/Student';
import Cookies from 'js-cookie';

const EditProfile = () => {
  const { control, handleSubmit } = useForm();
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [profileName, setprofileName] = useState(null);
  const loggedInUserId = Cookies.get('user_id');

  useEffect(() => {
    StudentsApi.getDetails(loggedInUserId).then(({ data }) => {
      setprofileName(data.details);
    });
  }, []);

  const showAlertDialog = (isShow, message) => {
    setShowAlert(isShow);
    setAlertMessage(message);
  };

  const handleOnSubmit = async ({ name, email, password }) => {
    try {
      await ProfileEditApi.profileEdit({ name, email, password });
      window.location = '/profile/view';
    } catch (error) {
      console.log(error.response);
      if (error?.response?.data?.errors) {
        setErrors(error?.response?.data?.errors);
      } else if (error?.response?.data?.error) {
        showAlertDialog(true, 'The password you have entered is incorrect.');
      } else {
        showAlertDialog(true, 'An error has occurred.');
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center text-align-center"
      style={{ marginTop: '150px' }}
    >
      {showAlert && (
        <Alert
          className={style.allertstyle}
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Card
        style={{
          width: '430px',
          padding: '50px',
          paddingTop: '20px',
          backgroundColor: '#E0EAEC',
        }}
      >
        <div className={style.HeadingText}>Edit Account Info</div>
        {profileName === null ? (
          <div className={style.loading}>
            <Spinner animation="border" role="status"></Spinner>
            <span className={style.loadingWord}>Loading</span>
          </div>
        ) : (
          <Form
            onSubmit={handleSubmit(handleOnSubmit)}
            style={{ marginTop: '20px' }}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label
                style={{
                  marginBottom: '0px',
                  color: '#48535B',
                  fontSize: '16px',
                }}
              >
                Name
              </Form.Label>
              {profileName ? (
                <Controller
                  control={control}
                  name="name"
                  defaultValue={profileName?.name}
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      className="cntrs"
                      type="text"
                      placeholder="e.g. jhondoe"
                      isInvalid={!!errors?.name}
                      required
                      maxLength={50}
                    />
                  )}
                />
              ) : (
                ''
              )}
              <Form.Control.Feedback type="invalid">
                {errors?.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label style={{ marginBottom: '0px', color: '#48535B' }}>
                Email
              </Form.Label>
              {profileName ? (
                <Controller
                  control={control}
                  name="email"
                  defaultValue={profileName?.email}
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      className="cntrs"
                      type="email"
                      placeholder="e.g. jhondoe@gmail.com"
                      isInvalid={!!errors?.email}
                      required
                      maxLength={50}
                    />
                  )}
                />
              ) : (
                ''
              )}

              <Form.Control.Feedback type="invalid">
                {errors?.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label style={{ marginBottom: '0px', color: '#48535B' }}>
                Password
              </Form.Label>
              {profileName ? (
                <Controller
                  control={control}
                  name="password"
                  defaultValue={profileName?.password}
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      className="cntrs"
                      type="password"
                      placeholder="**********"
                      isInvalid={!!errors?.password}
                      required
                      maxLength={50}
                    />
                  )}
                />
              ) : (
                ''
              )}
              <Form.Control.Feedback type="invalid">
                {errors?.password}
              </Form.Control.Feedback>
            </Form.Group>

            <div className={style.buttonposition}>
              <Button
                className={style.changepassbutton}
                variant="primary"
                type="submit"
              >
                Change
              </Button>
              <div>
                <a className={style.cancel} href="/profile">
                  Cancel
                </a>
              </div>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

EditProfile.propTypes = {
  name: PropTypes.any,
  email: PropTypes.any,
};

export default EditProfile;
