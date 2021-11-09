import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { Button, Alert } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import style from './index.module.css';
import Cookies from 'js-cookie';
import AuthApi from '../../../../api/Auth';

const Login = () => {
  const { register, control, handleSubmit, data } = useForm();
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlertDialog = (isShow, message) => {
    setShowAlert(isShow);
    setAlertMessage(message);
  };

  const handleOnSubmit = async ({ email, password }) => {
    try {
      const response = await AuthApi.login({ email, password });
      Cookies.set('access_token', response.data.token);
      window.location = '/';
    } catch (error) {
      console.log(error.response);
      if (error?.response?.data?.errors) {
        setErrors(error?.response?.data?.errors);
      } else if (error?.response?.data?.error) {
        showAlertDialog(true, error?.response?.data?.error?.message);
      } else {
        showAlertDialog(true, 'An error has occurred.');
      }
    }
  };

  return (
    <div>
      {showAlert && (
        <Alert
          className="mx-4 my-4"
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Container style={{ marginTop: '200px' }}>
        <Stack gap={2} className="col-md-5 mx-auto" id={style.log01}>
          <Form onSubmit={handleSubmit(handleOnSubmit)}>
            <div>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>
                  <h5>Email Address</h5>
                </Form.Label>
                <Controller
                  control={control}
                  name="email"
                  defaultValue=""
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      className="cntrs"
                      type="email"
                      placeholder="Input Email Address"
                      isInvalid={errors?.email}
                      required
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>
                  <h5>Password</h5>
                </Form.Label>
                <Controller
                  control={control}
                  name="password"
                  defaultValue=""
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Control
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      className="cntrs"
                      type="password"
                      name="password"
                      placeholder="************"
                      isInvalid={errors?.password}
                      required
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.password}
                </Form.Control.Feedback>
              </Form.Group>

              <p className={style.sign}>
                <LinkContainer to="/reset-password">
                  <a style={{ textDecoration: 'none' }} href="/#">
                    Forgot password?
                  </a>
                </LinkContainer>
              </p>

              <center>
                <Button className={style.Btncolor} type="submit">
                  <h5>Sign In</h5>
                </Button>
              </center>

              <center>
                <div className="cnb">
                  <p className={style.sign}>No Account Yet?</p>
                  <h5 className={style.sign}>
                    <LinkContainer to="/registration">
                      <a style={{ textDecoration: 'none' }} href="/#">
                        Sign Up
                      </a>
                    </LinkContainer>
                  </h5>
                </div>
              </center>
            </div>
          </Form>
        </Stack>
      </Container>
    </div>
  );
};

export default Login;
