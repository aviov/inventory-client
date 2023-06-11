import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getEndUserAccount, QUERY_listEndUsers } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { ImCheckmark } from 'react-icons/im';
import { v1 as uuidv1 } from 'uuid';
import { useAuthContext } from "../libs/contextLib";
import { useUserContext } from '../libs/contextLib';
import LoadingButton from './LoadingButton';
import './EndUserAccount.css'
import {
  MUTATION_createEndUser,
  MUTATION_deleteEndUser,
  MUTATION_updateEndUser,
  MUTATION_verifyEndUserEmailRequest
} from "../api/mutations";
import validator from 'validator';
import { sliceStringAfter } from "../libs/fnsLib";
import { onError } from "../libs/errorLib";

function EndUserAccount() {
  const { isAuthenticated } = useAuthContext();
  // const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { currentUserName } = useUserContext();
  const email = currentUserName && sliceStringAfter(currentUserName, ':');
  const [endUser, setEndUser] = useState({
    id: '',
    name: '',
    email,
    emailVerified: email,
    phone: '',
    isClientSendEmail: false
  });
  const [endUserUpdate, setEndUserUpdate] = useState({
    id: '',
    name: '',
    email,
    emailVerified: email,
    phone: '',
    isClientSendEmail: false
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getEndUserAccount, { data, loading }] = useLazyQuery(QUERY_getEndUserAccount);
  const [createEndUser] = useMutation(MUTATION_createEndUser, {
    refetchQueries: [
      { query: QUERY_getEndUserAccount },
      { query: QUERY_listEndUsers }
    ]
  });
  const [updateEndUser] = useMutation(MUTATION_updateEndUser);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifyEndUserEmailRequest] = useMutation(MUTATION_verifyEndUserEmailRequest, {
    refetchQueries: [{ query: QUERY_getEndUserAccount }]
  });
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [deleteEndUser] = useMutation(MUTATION_deleteEndUser, {
    refetchQueries: [
      { query: QUERY_getEndUserAccount },
      { query: QUERY_listEndUsers }
    ]
  });
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        getEndUserAccount();
        const endUserAccount = data && data.getEndUserAccount;
        if (endUserAccount) {
          const {
            id,
            name,
            email,
            emailVerified,
            phone,
            isClientSendEmail
          } = endUserAccount;
          setEndUser(endUserAccount);
          setEndUserUpdate({
            id,
            name,
            email,
            phone,
            isClientSendEmail: isClientSendEmail === true ? true : false
          });
          setIsEmailVerified(
            ((emailVerified && emailVerified) === (email && email))
          )
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getEndUserAccount, data]);

  async function handleSubmit({
    id,
    name,
    email,
    phone,
    isClientSendEmail
  }) {
    if (id && id !== '') {
      setIsUpdating(true);
      try {
        const data = await updateEndUser({
          variables: {
            endUser: {
              id,
              name,
              email,
              phone,
              isClientSendEmail
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
    if (!id || id === '') {
      setIsLoading(true);
      const id = 'enduser:account:' + uuidv1();
      const dateCreatedAt = new Date();
      try {
        const endUserCreated = await createEndUser({
          variables: {
            endUser: {
              id,
              name,
              dateCreatedAt,
              email,
              phone
            }
          }
        })
        if (endUserCreated) {
          setIsLoading(false);
          setIsUpdating(false);
          setIsEditing(false);
        }
      } catch (error) {
        onError(error);
        setIsLoading(false);
      }
    }
  }

  async function handleSubmitVeriry({
    id,
    name,
    email
  }) {
    if (!validator.isEmail(email)) {
      alert(
        email +
        ' is not correct email. ' +
        '\nUpdate and save email. ' +
        '\nAfter this verify correct email.' +
        '\nConfirmation will be sent to this email.'
      );
      return null;
    }
    setIsVerifyingEmail(true);
    try {
      const data = await verifyEndUserEmailRequest({
        variables: {
          endUser: {
            id,
            name,
            email
          }
        }
      });
      if (data) {
        setIsVerifyingEmail(false);
        setIsEditing(false);
        alert('Confirmation link is sent to ' + endUser.name + '\'s email ' + endUser.email);
      }
    } catch (error) {
      onError(error);
    }
  }

  async function handleDelete(endUser) {
    const confirmed = window.confirm(`Do you want to delete end user ${endUser.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteEndUser({ variables: { endUserId: endUser.id } });
        // navigate('/endUsers');
      } catch (error) {
        onError(error);
      }
      setEndUser({
        id: '',
        name: '',
        email,
        emailVerified: email,
        phone: '',
        isClientSendEmail: false
      })
      setIsDeleting(false);
      setIsEditing(false);
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
      className='EndUserAccount'
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
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
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
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
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
                    placeholder='Email that exist'
                    disabled={true}
                    value={endUserUpdate.email}
                    onChange={(event) => setEndUserUpdate({ ...endUserUpdate, email: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                {isEmailVerified ? 'Email verified' : 'Email not verified'}
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <>
                    {isEmailVerified &&
                      <ImCheckmark as={Form.Control} color='green'/>
                    }
                  </>
                ) : (
                  <>
                    {!isEmailVerified ? (
                      <LoadingButton
                        className='LoadingButton'
                        size='sm'
                        variant='outline-primary'
                        disabled={isVerifyingEmail}
                        type='submit'
                        isLoading={isVerifyingEmail}
                        onClick={() => handleSubmitVeriry(endUserUpdate)}
                      >
                        Verify email
                      </LoadingButton>
                    ) : (
                      <ImCheckmark as={Form.Control} color='green'/>
                    )}
                  </>
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
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Send email with future actions
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <>
                    {endUser.isClientSendEmail &&
                      <ImCheckmark as={Form.Control} color='green'/>
                    }
                  </>
                ) : (
                  <Form.Check
                    type='switch'
                    id='isClientSendEmail'
                    disabled={!isEmailVerified}
                    label={!isEmailVerified ? 'Verify email to use this' : ''}
                    checked={endUserUpdate.isClientSendEmail ? true : false}
                    onChange={() => setEndUserUpdate({ ...endUserUpdate, isClientSendEmail: endUserUpdate.isClientSendEmail ? false : true })}
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

export default EndUserAccount