import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './Login.css';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import {
  useAuthContext,
  useUserContext,
  useTenantContext
} from '../libs/contextLib';
import LoadingButton from './LoadingButton';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';

export default function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();
  const { setCurrentUserName } = useUserContext();
  const { setCurrentTenantId } = useTenantContext();
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
      await signIn({ username: email, password });
      setCurrentUserName(email);
      setIsAuthenticated(true);
      const currentSession = await fetchAuthSession();
      // console.log('currentSession', currentSession);
      const currentTenantId = (currentSession.tokens.idToken.payload['cognito:groups'] || [])[0]
      if (currentTenantId !== null) {
        setCurrentTenantId(currentTenantId);
        navigate('/');
      } else {
        navigate('/tenants');
      }
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
        <Form.Group className='mb-3'>
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
        <Form.Group className='mb-3'>
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
        <div className='d-grid gap-2'>
          <LoadingButton
            // block
            disabled={!validateForm()}
            type='submit'
            isLoading={isLoading}
          >
            Login
          </LoadingButton>
        </div>
      </Form>
    </div>
  )
}