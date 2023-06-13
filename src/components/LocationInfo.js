import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getLocationById, QUERY_listLocations } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import './LocationInfo.css'
import { MUTATION_deleteLocation, MUTATION_updateLocation } from "../api/mutations";
import { onError } from "../libs/errorLib";

function LocationInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState({
    id,
    name: '',
    email: '',
    phone: '',
    webPage: '',
    city: '',
    country: '',
  });
  const [locationUpdate, setLocationUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getLocationById, { data, loading }] = useLazyQuery(QUERY_getLocationById);
  const [updateLocation] = useMutation(MUTATION_updateLocation);
  const [deleteLocation] = useMutation(MUTATION_deleteLocation, {
    refetchQueries: [{ query: QUERY_listLocations }]
  });
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        getLocationById({
          variables: { locationId: id }
        });
        const locationById = data && data.getLocationById;
        if (locationById) {
          const {
            id,
            name,
            email,
            phone,
            webPage,
            country,
            city,
          } = locationById;
          setLocation(locationById);
          setLocationUpdate({
            id,
            name,
            email,
            phone,
            webPage,
            city,
            country,
          });
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getLocationById, id, data]);

  async function handleSubmit({
    id,
    name,
    email,
    phone,
    webPage,
    city,
    country,
  }) {
    setIsUpdating(true);
    try {
      const data = await updateLocation({
        variables: {
          location: {
            id,
            name,
            email,
            phone,
            webPage,
            city,
            country,
          }
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } catch (error) {
      onError(error);
    }
  }

  async function handleDelete(location) {
    const confirmed = window.confirm(`Do you want to delete location ${location.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteLocation({ variables: { locationId: id } });
        navigate('/locations');
      } catch (error) {
        onError(error);
      }
      setIsDeleting(false);
    } else {
      return null;
    }
  };

  if (loading || isLoading) {
    return(
      <div
        className='Loading'
      >
        <ImSpinner2
          className='spinning'
        />
      </div>
    )
  }

  return(
    <div
      className='LocationInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <div className="d-flex justify-content-end">
              {!isEditing ?
                (
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    color='orange'
                    variant='outline-warning'
                    disabled={false}
                    type='submit'
                    isLoading={false}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </LoadingButton>
                ) : (
                  <>
                    <LoadingButton
                      className='LoadingButton'
                      size='sm'
                      color='red'
                      variant='outline-danger'
                      disabled={isDeleting}
                      type='submit'
                      isLoading={isDeleting}
                      onClick={() => handleDelete(location)}
                    >
                      Delete
                    </LoadingButton>
                    <LoadingButton
                      className='LoadingButton'
                      size='sm'
                      variant='outline-primary'
                      disabled={isUpdating}
                      type='submit'
                      isLoading={isUpdating}
                      onClick={() => handleSubmit(locationUpdate)}
                    >
                      Save
                    </LoadingButton>
                    <LoadingButton
                      className='LoadingButton'
                      size='sm'
                      variant='outline-secondary'
                      disabled={false}
                      type='submit'
                      isLoading={false}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </LoadingButton>
                  </>
                )
              }
            </div>
            <hr/>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Name
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={location.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={locationUpdate.name}
                    onChange={(event) => setLocationUpdate({ ...locationUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Email
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={location.email}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Email'
                    value={locationUpdate.email}
                    onChange={(event) => setLocationUpdate({ ...locationUpdate, email: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Phone
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={location.phone}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Phone'
                    value={locationUpdate.phone}
                    onChange={(event) => setLocationUpdate({ ...locationUpdate, phone: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Web page
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={location.webPage}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Web page'
                    value={locationUpdate.webPage}
                    onChange={(event) => setLocationUpdate({ ...locationUpdate, webPage: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <hr/>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                City
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={location.city}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='City'
                    value={locationUpdate.city}
                    onChange={(event) => setLocationUpdate({ ...locationUpdate, city: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Country
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={location.country}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Country'
                    value={locationUpdate.country}
                    onChange={(event) => setLocationUpdate({ ...locationUpdate, country: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <hr style={{ marginBottom: 30 }}/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LocationInfo