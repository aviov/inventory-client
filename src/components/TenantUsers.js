import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_listTenantUsers } from "../api/queries";
import { QUERY_listEndUsers } from '../api/queries';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { ImSpinner2 } from 'react-icons/im';
import { ImUser } from 'react-icons/im';
import LoadingButton from './LoadingButton';
import Select from 'react-select';
import './TenantUsers.css'
import {
  MUTATION_inviteTenantUserRequest,
  MUTATION_deleteTenantUser
} from "../api/mutations";
import { useUserContext, useTenantUserContext } from '../libs/contextLib';
import { sliceStringAfter } from "../libs/fnsLib";
import { onError } from "../libs/errorLib";

function TenantUsers() {
  const { currentTenantUser } = useTenantUserContext();
  const [tenantUsers, setTenantUsers] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [listTenantUsers, { loading, data, client }] = useLazyQuery(QUERY_listTenantUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [endUserInvite, setEndUserInvite] = useState({});
  const [inviteTenantUserRequest] = useMutation(MUTATION_inviteTenantUserRequest);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTenantUser] = useMutation(MUTATION_deleteTenantUser, {
    refetchQueries: [{ query: QUERY_listTenantUsers }],
    awaitRefetchQueries: true
  });
  const [endUserOption, setEndUserOption] = useState(null);
  const [endUserOptions, setEndUserOptions] = useState([]);
  const { currentUserName } = useUserContext();
  const userEmail = currentUserName && sliceStringAfter(currentUserName, ':');
  let ref = useRef(null);
  // const [tenantUsersLimit] = useState(7);
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        listTenantUsers();
        setTenantUsers(data ? data.listTenantUsers : []);
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, listTenantUsers, data]);

  // function validateForm(fields={}) {
  //   if(Object.values(fields).includes('')) {
  //     return false
  //   } else {
  //     return true
  //   }
  // };

  async function loadEndUserOptions({ data, userEmail }) {
    try {
      const { data: dataEndUsers } = await client.query({
        query: QUERY_listEndUsers,
        // fetchPolicy: 'cache-first'
      });
      if (dataEndUsers && dataEndUsers.listEndUsers) {
        const endUsers = (dataEndUsers.listEndUsers || []).map(({ id, name, email, emailVerified, phone }) =>
          ({ value: id, label: name + ' | ' + emailVerified, id, name, email, emailVerified, phone }));
        const options = endUsers.filter(({ email, emailVerified }) => 
            !(!emailVerified || emailVerified === null || emailVerified === userEmail || email === userEmail)
          ).filter(({ email }) => 
            !((data ? data.listTenantUsers : []).find((tenantUser) => tenantUser.emailVerified === email))
        );
        setEndUserOptions(options);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleSubmitInvite({
    name,
    emailVerified,
    userEmail,
    currentTenantName
  }) {
    setIsUpdating(true);
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
        setIsUpdating(false);
        setIsInviting(false);
        setEndUserOption(null);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleDelete(tenantUser) {
    const {
      id,
      name,
      nameTwo
    } = tenantUser;
    const confirmed = window.confirm(`Do you want to delete user ${nameTwo} from ${name}?`);
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

  if (isLoading || loading) {
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
      className='TenantUsers'
    >
      <div>
        <h6>
          Users
        </h6>
        {((tenantUsers && tenantUsers.length) > 0) &&
          <hr/>
        }
      </div>
      {(tenantUsers.length > 0) &&
        tenantUsers.map(({ id, name, nameTwo, emailVerified, inviteInfo }, index) => (
          <div key={id}>
            <Card
              className='Card'
              bsPrefix={'shadow p-3 bg-white rounded'}
            >
              <Card.Body>
                <Card.Title 
                  className="d-flex justify-content-between align-items-center"
                >
                  {nameTwo}
                  {(inviteInfo && JSON.parse(inviteInfo).dateAccept && JSON.parse(inviteInfo).dateAccept !== null) ? (
                    <Badge
                      bg="success"
                      className='font-weight-light'
                    >
                      Accepted
                    </Badge>
                  ) : (
                    <Badge
                      bg="warning"
                      className='font-weight-light'
                    >
                      Pending
                    </Badge>
                  )}
                </Card.Title>
                <Form.Group className='mb-3' as={Row}>
                  <Form.Label column='sm=4' className='font-weight-bold'>
                    Email
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      plaintext
                      readOnly
                      value={emailVerified || ''}
                    />
                  </Col>
                </Form.Group>
                {currentUserName && currentUserName.startsWith('owner:') &&
                  <div className="d-flex justify-content-end">
                    {!isEditing || (isEditing && ref.current !== index) ?
                      (
                        <LoadingButton
                          style={{
                            margin: 4
                          }}
                          size='sm'
                          color='orange'
                          variant='outline-warning'
                          disabled={isEditing && ref.current !== index}
                          type='submit'
                          isLoading={false}
                          onClick={() => {
                            setIsEditing(true);
                            ref.current = index;
                          }}
                        >
                          Edit
                        </LoadingButton>
                      ) : (
                        <>
                          <LoadingButton
                            style={{
                              margin: 4
                            }}
                            size='sm'
                            variant='outline-danger'
                            disabled={isDeleting && ref.current === index}
                            type='submit'
                            isLoading={isDeleting && ref.current === index}
                            hidden={ref.current !== index}
                            onClick={async () => {
                              await handleDelete({ id, name, nameTwo });
                              setIsEditing(false);
                              ref.current = null;
                            }}
                          >
                            Revoke access
                          </LoadingButton>
                          <LoadingButton
                            style={{
                              margin: 4
                            }}
                            size='sm'
                            variant='outline-secondary'
                            disabled={false}
                            type='submit'
                            isLoading={false}
                            hidden={ref.current !== index}
                            onClick={() => {
                              setIsEditing(false);
                              ref.current = null;
                            }}
                          >
                            Cancel
                          </LoadingButton>
                        </>
                      )
                    }
                  </div>
                }
              </Card.Body>
            </Card>
        </div>
      ))}
      <hr/>
      {isInviting &&
        <Card
          className='Card'
          bsPrefix={'shadow-lg p-3 bg-white rounded'}
        >
          <Card.Body>
            <Card.Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Invite user
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <LoadingButton
                    style={{
                      margin: 4
                    }}
                    className='LoadingButton'
                    size='sm'
                    variant='outline-primary'
                    disabled={isUpdating || !endUserInvite.emailVerified}
                    type='submit'
                    isLoading={isUpdating}
                    onClick={() => (endUserInvite.emailVerified && endUserInvite.emailVerified !== null) && handleSubmitInvite({
                      ...endUserInvite,
                      userEmail,
                      currentTenantName: currentTenantUser && currentTenantUser.name
                    })}
                  >
                    Invite
                  </LoadingButton>
                  <LoadingButton
                    style={{
                      margin: 4
                    }}
                    className='LoadingButton'
                    size='sm'
                    variant='outline-secondary'
                    disabled={isUpdating}
                    type='submit'
                    isLoading={false}
                    onClick={() => {
                      setIsUpdating(false);
                      setIsInviting(false);
                      setEndUserInvite({});
                      setEndUserOption(null);
                    }}
                  >
                    Cancel
                  </LoadingButton>
                </div>
              </div>
            </Card.Title>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                <ImUser/>
              </Form.Label>
              <Col sm='8'>
                <Select
                  isClearable={true}
                  value={endUserOption}
                  options={endUserOptions}
                  onChange={(option) => {
                    setEndUserOption(option);
                    setEndUserInvite({
                      ...endUserInvite,
                      // tenantId,
                      endUserId: option ? option.value : '',
                      name: option ? option.name : '',
                      emailVerified: option ? option.emailVerified : '',
                      email: option ? option.email : '',
                      phone: option ? option.phone : ''
                    });
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Email
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  value={endUserInvite.email || ''}
                />
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
      }
      <Row className='justify-content-center'>
        {!isInviting && currentUserName && currentUserName.startsWith('owner:') &&
          <div className='d-grid gap-2'>
            <LoadingButton
              className='LoadingButton'
              size='sm'
              color='orange'
              variant='outline-primary'
              disabled={false}
              type='submit'
              isLoading={false}
              onClick={() => {
                setEndUserOption(null);
                setIsInviting(true);
                loadEndUserOptions({ data, userEmail });
              }}
            >
              Invite user
            </LoadingButton>
          </div>
        }
      </Row>
    </div>
  )
};

export default TenantUsers;