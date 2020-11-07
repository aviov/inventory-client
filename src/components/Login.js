import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './Login.css';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../libs/contextLib';
import LoadingButton from './LoadingButton';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';

export default function Login() {
  const history = useHistory();
  const { setIsAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: ''
  });
  const { email, password } = fields;

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(email, password);
      setIsAuthenticated(true);
      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    };
  }

  return (
    <div className='Login'>
      <Form
        onSubmit={handleSubmit}
      >
        <Form.Group>
          <Form.Label>
            Email
          </Form.Label>
          <Form.Control
            type='email'
            placeholder='Email'
            id={'email'}
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
            id={'password'}
            value={password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoadingButton
          block
          disabled={!validateForm()}
          type='submit'
          isLoading={isLoading}
        >
          Login
        </LoadingButton>
      </Form>
    </div>
  )
}