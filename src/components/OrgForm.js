import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { v1 as uuidv1 } from 'uuid';
import { useMutation } from '@apollo/client'
import { MUTATION_createOrg } from '../api/mutations'
import { QUERY_listOrgs } from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import './OrgForm.css';

function OrgForm({ prefix }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [webPage, setWebPage] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createOrg] = useMutation(MUTATION_createOrg, {
    refetchQueries: [
      {
        query: QUERY_listOrgs,
        variables: { prefix }
      }
    ]
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
    const id = prefix + 'org:' + uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    try {
      const orgCreated = await createOrg({
        variables: {
          org: {
            id,
            dateCreatedAt,
            name,
            email,
            phone,
            webPage,
            city,
            country,
          }
        }
      })
      if (orgCreated) {
        setIsLoading(false);
        setName('');
        setEmail('');
        setPhone('');
        setWebPage('');
        setCity('');
        setCountry('');
        navigate.goBack();
        // navigate('/orgs');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  return(
    <div
      className='OrgForm'
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
            Email
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Email'
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
        <Form.Group className='mb-3'>
          <Form.Label>
            City
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='City'
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Country
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Country'
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </Form.Group>
        <LoadingButton
          // block
          disabled={!validateForm({
            name,
            // email,
            // phone,
            // webPage,
            // city,
            // country
          })}
          type='submit'
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Form>
    </div>
  )
}

export default OrgForm