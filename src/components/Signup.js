import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../libs/contextLib';
import LoadingButton from './LoadingButton';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Signup.css';

export default function Signup() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });
  const {
    email,
    password,
    confirmPassword,
    confirmationCode
  } = fields;
  const [newUser, setNewUser] = useState(null);
  const { isAuthenticated } = useAppContext();

  function validateSignupForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword === password
    );
  };

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  };

  async function handleSubmitSignup(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  async function handleSubmitConfirmation(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      isAuthenticated(true);
      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  function renderSignupForm() {
    return(
      <Form
        className='form'
        onSubmit={handleSubmitSignup}
      >
        <Form.Group>
          <Form.Label>
            Email
          </Form.Label>
          <Form.Control
            type='email'
            placeholder='Email'
            id='email'
            value={email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Password
          </Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            id='password'
            value={password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Confirm password
          </Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoadingButton
          block
          type='submit'
          disabled={!validateSignupForm()}
          isLoading={isLoading}
        >
          Signup
        </LoadingButton>
      </Form>
    )
  };

  function renderConfirmationForm() {
    return(
      <Form
        className='form'
        onSubmit={handleSubmitConfirmation}
      >
        <Form.Group>
          <Form.Label>
            Confirmation code
          </Form.Label>
          <Form.Control
            autoFocus
            type='tel'
            placeholder='Confirmation code'
            id={'confirmationCode'}
            value={confirmationCode}
            onChange={handleFieldChange}
          />
          <Form.Text id="help-text" muted>
            {`Check your email. The code is sent to your email ${email}`}
          </Form.Text>
        </Form.Group>
        <LoadingButton
          block
          type='submit'
          disabled={!validateConfirmationForm()}
          isLoading={isLoading}
        >
          Verify
        </LoadingButton>
      </Form>
    )
  };
  
  return(
    <div className='Signup'>
      {newUser === null ? renderSignupForm() : renderConfirmationForm()}
    </div>
  )

};