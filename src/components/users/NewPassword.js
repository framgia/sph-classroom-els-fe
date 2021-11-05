import React from 'react';
import '../css/GlobalStyle.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

const NewPassword = () => (<center>
    <Container>
        <Stack gap={2} className="col-md-5 mx-auto">

            <Form className="cont">
                <div align="start" className="suggestion">
                    Create a new password that is at least 6 characters long. A strong password is a combination of letters, numbers, and symbols.
                </div>
                <div className="left" align="start">
                    <Form.Group className="mb-3" controlId="NewPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="***********" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="***********" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>


                    <center>
                        <Button variant="primary" type="submit" id="btp">
                            Continue
                        </Button>
                    </center>
                </div>
            </Form>

        </Stack>
    </Container>
</center>);
export default NewPassword;