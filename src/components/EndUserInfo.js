import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getEndUserById, QUERY_listEndUsers } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import './EndUserInfo.css'
import { MUTATION_deleteEndUser, MUTATION_updateEndUser } from "../api/mutations";
import { onError } from "../libs/errorLib";

function EndUserInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [endUser, setEndUser] = useState({
    id,
    name: '',
    email: '',
    phone: ''
  });
  const [endUserUpdate, setEndUserUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getEndUserById, { data, loading }] = useLazyQuery(QUERY_getEndUserById);
  const [updateEndUser] = useMutation(MUTATION_updateEndUser);
  const [deleteEndUser] = useMutation(MUTATION_deleteEndUser, {
    refetchQueries: [{ query: QUERY_listEndUsers }]
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      setIsLoading(true);
      try {
        getEndUserById({
          variables: { endUserId: id }
        });
        const endUserById = data && data.getEndUserById;
        // console.log(data);
        if (endUserById) {
          const {
            id,
            name,
            email,
            phone
          } = endUserById;
          setEndUser(endUserById);
          setEndUserUpdate({
            id,
            name,
            email,
            phone
          });
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getEndUserById, id, data]);

  async function handleSubmit({
    id,
    name,
    email,
    phone
  }) {
    setIsUpdating(true);
    try {
      const data = await updateEndUser({
        variables: {
          endUser: {
            id,
            name,
            email,
            phone
          }
        }
      });
      // console.log('data', data);
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } catch (error) {
      onError(error);
    }
  }

  // console.log(typeof endUser.dateWarrantyBegins);
  // console.log(endUser.dateWarrantyBegins)
  // console.log(endUser.dateWarrantyExpires)


  async function handleDelete(endUser) {
    const confirmed = window.confirm(`Do you want to delete end user ${endUser.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteEndUser({ variables: { endUserId: id } });
        history.push('/endUsers');
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
  // const endUser = data.getEndUserById;
  // console.log(data);
  return(
    <div
      className='EndUserInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <Row className='justify-content-end'>
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
                      onClick={() => handleDelete(endUser)}
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
                      onClick={() => handleSubmit(endUserUpdate)}
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
            </Row>
            <hr/>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Name
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={endUser.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={endUserUpdate.name}
                    onChange={(event) => setEndUserUpdate({ ...endUserUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Email
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={endUser.email}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Email'
                    value={endUserUpdate.email}
                    onChange={(event) => setEndUserUpdate({ ...endUserUpdate, email: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Name
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={endUser.phone}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Phone'
                    value={endUserUpdate.phone}
                    onChange={(event) => setEndUserUpdate({ ...endUserUpdate, phone: event.target.value })}
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

export default EndUserInfo