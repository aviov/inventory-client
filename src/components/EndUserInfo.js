import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  QUERY_getEndUserById,
  QUERY_listTenantUsers,
  QUERY_listEndUsers
} from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { ImCheckmark } from 'react-icons/im';
import { useUserContext, useAuthContext, useTenantUserContext } from "../libs/contextLib";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import LoadingButton from './LoadingButton';
import './EndUserInfo.css'
import {
  MUTATION_deleteEndUser,
  MUTATION_deleteTenantUser,
  MUTATION_updateEndUser,
  MUTATION_verifyEndUserEmailRequest,
  MUTATION_inviteTenantUserRequest
} from "../api/mutations";
import validator from 'validator';
import { sliceStringAfter } from "../libs/fnsLib";
import { onError } from "../libs/errorLib";

function EndUserInfo() {
  const { isAuthenticated } = useAuthContext();
  const { currentUserName } = useUserContext();
  const userEmail = currentUserName && sliceStringAfter(currentUserName, ':');
  const { currentTenantUser } = useTenantUserContext();
  const { parentId, id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [endUser, setEndUser] = useState({
    id,
    name: '',
    email: '',
    emailVerified: '',
    phone: '',
    isClientSendEmail: false
  });
  const [endUserUpdate, setEndUserUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getEndUserById, { data, loading, client }] = useLazyQuery(QUERY_getEndUserById);
  const [updateEndUser] = useMutation(MUTATION_updateEndUser);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifyEndUserEmailRequest] = useMutation(MUTATION_verifyEndUserEmailRequest, {
    refetchQueries: [{ query: QUERY_getEndUserById, variables: { endUserId: id } }]
  });
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [inviteTenantUserRequest] = useMutation(MUTATION_inviteTenantUserRequest);
  // const [tenantUsers, setTenantUsers] = useState(null);
  const [isUserInvited, setIsUserInvited] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [deleteEndUser] = useMutation(MUTATION_deleteEndUser, {
    refetchQueries: parentId ? [
      { query: QUERY_listEndUsers, variables: { prefix: `org:enduser::${parentId}:` } }
    ] : [
      { query: QUERY_listEndUsers }
    ]
  });
  const [deleteTenantUser] = useMutation(MUTATION_deleteTenantUser, {
    refetchQueries: [
      {
        query: QUERY_listTenantUsers
      },
      {
        query: QUERY_getEndUserById,
        variables: { endUserId: endUser.id }
      }
    ],
    awaitRefetchQueries: true
  });
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        getEndUserById({
          variables: { endUserId: id }
        });
        const endUserById = data && data.getEndUserById;
        if (endUserById) {
          const {
            id,
            name,
            email,
            emailVerified,
            phone,
            isClientSendEmail
          } = endUserById;
          setEndUser(endUserById);
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
  },[isAuthenticated, getEndUserById, id, data]);

  async function handleSubmit({
    id,
    name,
    email,
    phone,
    isClientSendEmail
  }) {
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

  async function loadTenantUsers({
    client,
    queryGql
  }) {
    try {
      const { data: dataTenantUsers } = await client.query({
        query: queryGql
      });
      if (dataTenantUsers) {
        return dataTenantUsers.listTenantUsers
      }
      return []
    } catch (error) {
      onError(error);
    }
  };

  function getUserInvited({
    tenantUsers,
    emailVerified
  }) {
    const tenantUser = tenantUsers.find((tenantUser) => tenantUser.emailVerified === emailVerified);
    if (tenantUser) {
      return { user: tenantUser, isInvited: true };
    }
    return { user: null, isInvited: false };
  };

  async function handleSubmitInvite({
    name,
    email,
    emailVerified,
    userEmail,
    currentTenantName
  }) {
    if (!emailVerified || emailVerified === null || emailVerified === userEmail || email === userEmail) {
      window.alert(`Can not invite yourself to own organisation.
                    \n The user ${emailVerified} is the owner of organisation
                    \n currently logged in.`);
      return null;
    }
    if (isUserInvited) {
      window.alert(`This person with email ${emailVerified} was aready user at ${currentTenantName}.`);
      return null;
    }
    setIsInviting(true);
    const tenantUserId = 'tenantuser:';
    const dateCreatedAt = new Date();
    const dateInvitedAt = new Date();
    const inviteInfo = {
      nameInvitedBy: userEmail,
      emailInvitedBy: userEmail,
      tenantInvitedTo: currentTenantName,
      nameInvited: name,
      emailInvited: emailVerified,
      dateInvitedAt
    };
    const inviteInfoJSON = JSON.stringify(inviteInfo);
    const tenantUserInput = {
      id: tenantUserId,
      dateCreatedAt,
      name: currentTenantName,
      nameTwo: name,
      emailVerified,
      inviteInfo: inviteInfoJSON
    }
    try {
      const data = await inviteTenantUserRequest({
        variables: {
          tenantUser: tenantUserInput
        },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: QUERY_listTenantUsers
          }
        ]
      });
      if (data) {
        setIsUserInvited(true);
        setIsUpdating(false);
        setIsInviting(false);
        // setEndUserOption(null);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleDelete(endUser) {
    const confirmed = window.confirm(`Do you want to delete end user ${endUser.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteEndUser({ variables: { endUserId: id } });
        navigate.goBack();
      } catch (error) {
        onError(error);
      }
      setIsDeleting(false);
    } else {
      return null;
    }
  };

  async function handleDeleteTenantUser(tenantUser) {
    const {
      id,
      name
    } = tenantUser;
    const confirmed = window.confirm(`Do you want to revoke user access to ${name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteTenantUser({ variables: { tenantUserId: id } });
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
                    onClick={async () => {
                      setIsEditing(true);
                      const tenantUsers = await loadTenantUsers({ client: client, queryGql: QUERY_listTenantUsers});
                      setIsUserInvited(getUserInvited({ tenantUsers, emailVerified: endUser.emailVerified }).isInvited);
                    }}
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
                {'User status'}
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={'Click Edit to know'}
                  />
                ) : (
                  <>
                    {!isUserInvited ? (
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) => (
                          <Tooltip id="button-tooltip" {...props}>
                            {!isEmailVerified ? 'Make sure the email is correct and belongs to user' : `Click to grant user access to ${currentTenantUser.name}`}
                          </Tooltip>)}
                        >
                        <LoadingButton
                          className='LoadingButton'
                          size='sm'
                          disabled={isInviting}
                          variant='outline-primary'
                          type='submit'
                          isLoading={isInviting}
                          onClick={() => isEmailVerified && handleSubmitInvite({
                            ...endUser,
                            userEmail,
                            currentTenantName: currentTenantUser.name
                          })}
                        >
                          Invite user
                        </LoadingButton>
                      </OverlayTrigger>
                    ) : (
                      <div style={{
                        display: 'flex',
                      }}>
                        <Form.Control
                          plaintext
                          readOnly
                          value={`Has user access to ${currentTenantUser.name}`}
                        />
                        <LoadingButton
                          style={{
                            margin: 4
                          }}
                          className='LoadingButton'
                          size='sm'
                          variant='outline-danger'
                          disabled={isDeleting}
                          type='submit'
                          isLoading={isDeleting}
                          onClick={async () => {
                            const tenantUsers = await loadTenantUsers({ client: client, queryGql: QUERY_listTenantUsers});
                            const userInvited = getUserInvited({ tenantUsers, emailVerified: endUser.emailVerified }).user;
                            await handleDeleteTenantUser(userInvited);
                            setIsEditing(false);
                          }}
                        >
                          {'Revoke'}
                        </LoadingButton>
                      </div>
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

export default EndUserInfo