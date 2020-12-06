import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { v1 as uuidv1 } from 'uuid';
import { useMutation } from '@apollo/client'
import { MUTATION_createLocation } from '../api/mutations'
import { QUERY_listLocations } from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import './LocationForm.css';

function LocationForm() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [webPage, setWebPage] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createLocation] = useMutation(MUTATION_createLocation, {
    refetchQueries: [{ query: QUERY_listLocations }]
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
    const id = 'location:' + uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    // console.log(
    //   'id', id,
    //   'dateCreatedAt', dateCreatedAt
    // )
    try {
      const locationCreated = await createLocation({
        variables: {
          location: {
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
      if (locationCreated) {
        setIsLoading(false);
        setName('');
        setEmail('');
        setPhone('');
        setWebPage('');
        setCity('');
        setCountry('');
        history.push('/locations');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  // console.log(files);
  return(
    <div
      className='LocationForm'
    >
      <Form>
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
          block
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

export default LocationForm