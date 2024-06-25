import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useAuthContext, useUserContext } from '../libs/contextLib';
import LoadingButton from './LoadingButton';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();
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
  const { setIsAuthenticated } = useAuthContext();
  const { setCurrentUserName } = useUserContext();

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
      const newUser = await signUp({
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
      await confirmSignUp(email, confirmationCode);
      await signIn(email, password);
      setCurrentUserName(email);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  function renderSignupForm() {
    return(
      <Form
        onSubmit={handleSubmitSignup}
      >
        <Form.Group className='mb-3'>
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
        <Form.Group className='mb-3'>
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
        <Form.Group className='mb-3'>
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
        <div className='d-grid gap-2'>
          <LoadingButton
            // block
            type='submit'
            disabled={!validateSignupForm()}
            isLoading={isLoading}
          >
            Signup
          </LoadingButton>
        </div>
      </Form>
    )
  };

  function renderConfirmationForm() {
    return(
      <Form
        onSubmit={handleSubmitConfirmation}
      >
        <Form.Group className='mb-3'>
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
        <div className='d-grid gap-2'>
          <LoadingButton
            type='submit'
            disabled={!validateConfirmationForm()}
            isLoading={isLoading}
          >
            Verify
          </LoadingButton>
        </div>
      </Form>
    )
  };
  
  return(
    <div className='Signup'>
      {newUser === null ? renderSignupForm() : renderConfirmationForm()}
    </div>
  )

};