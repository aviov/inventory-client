import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import validator from 'validator';
import { v1 as uuidv1 } from 'uuid';
import { useMutation } from '@apollo/client'
import { MUTATION_createGroup } from '../api/mutations'
import { QUERY_listGroups } from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import './GroupForm.css';

function GroupForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [regNr, setRegNr] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [webPage, setWebPage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createGroup] = useMutation(MUTATION_createGroup, {
    refetchQueries: [{ query: QUERY_listGroups }]
  });

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const id = 'group:' + uuidv1();
    const dateCreatedAt = new Date();
    if (!validator.isEmail(email)) {
      alert(
        email +
        ' is not correct email. ' +
        '\nEnter email that exist. ' +
        '\nAfter this verify correct email.' +
        '\nConfirmation will be sent to this email.'
      );
      return null;
    };
    if (!validator.isMobilePhone(phone, 'et-EE')) {
      alert(
        phone +
        ' is not mobile number. ' +
        '\nEnter mobile number that exist.'
      );
      return null;
    }
    setIsLoading(true);
    try {
      const groupCreated = await createGroup({
        variables: {
          group: {
            id,
            dateCreatedAt,
            name,
            regNr,
            email,
            phone,
            webPage
          }
        }
      })
      if (groupCreated) {
        setIsLoading(false);
        setName('');
        setEmail('');
        setPhone('');
        navigate('/groups');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return(
    <div
      className='GroupForm'
    >
      <Form>
        <Form.Group className='mb-3'>
          <Form.Label>
            Name
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Reg nr
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Reg nr'
            value={regNr}
            onChange={(event) => setRegNr(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Email
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Email that exist'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Phone
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Phone'
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Web page
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Web page'
            value={webPage}
            onChange={(event) => setWebPage(event.target.value)}
          />
        </Form.Group>
        <div className='d-grid gap-2'>
          <LoadingButton
            disabled={!validateForm({
              name,
              email,
              phone
            })}
            type='submit'
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </div>
      </Form>
    </div>
  )
}

export default GroupForm