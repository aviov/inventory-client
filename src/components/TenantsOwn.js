import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import {
  useLazyQuery,
  useMutation
} from '@apollo/client';
import { Auth } from 'aws-amplify';
import { v1 as uuidv1 } from 'uuid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { registerLocale } from 'react-datepicker';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
// import { ImSpinner2 } from 'react-icons/im';
import { VscOrganization } from 'react-icons/vsc';
import LoadingButton from './LoadingButton';
import './Tenants.css'
import { useAuthContext, useTenantContext } from "../libs/contextLib";
import { QUERY_listTenants } from "../api/queries";
import {
  MUTATION_createTenant,
  MUTATION_updateTenant,
  MUTATION_deleteTenant,
} from "../api/mutations";
import { onError } from "../libs/errorLib";
import enGb from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGb);

function TenantsOwn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const { setIsAuthenticated } = useAuthContext();
  const { currentTenantId, setCurrentTenantId } = useTenantContext();
  const [listTenants, { loading, data, client }] = useLazyQuery(QUERY_listTenants);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [tenantCreate, setTenantCreate] = useState({
    name: ''
  });
  const [createTenant] = useMutation(MUTATION_createTenant, {
    refetchQueries: [{ query: QUERY_listTenants }]
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [tenantUpdate, setTenantUpdate] = useState({});
  const [updateTenant] = useMutation(MUTATION_updateTenant);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTenant] = useMutation(MUTATION_deleteTenant, {
    refetchQueries: [{ query: QUERY_listTenants }]
  });
  let ref = useRef(null);
  // const [tenantsLimit] = useState(3);
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        listTenants();
        setTenants(data ? data.listTenants : []);
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[
    isAuthenticated,
    listTenants, data
  ]);

  async function refreshToken() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = cognitoUser.signInUserSession;
      cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {
        const tenantIds = session.idToken.payload['cognito:groups'] || [];
        setCurrentTenantId(tenantIds[0]);
        client.cache.reset();
        setIsAuthenticated(true);
        setIsUpdating(false);
        navigate('/');
      });
    } catch (error) {
      if (error !== 'No current user') {
        onError(error);
      }
    }
  };

  async function handleSubmitUpdateTenant(tenant) {
    // setIsUpdating(true);
    const dateTenantLogIn = new Date();
    const tenantInputUpdate = {
      id: tenant.id,
      dateTenantLogIn,
      state: JSON.stringify({
        someStateKey: 'someStateValueUpdated7'
      })
    };
    try {
      const data = await updateTenant({
        variables: {
          tenant: tenantInputUpdate
        }
      });
      if (data) {
        // setIsUpdating(false);
        // setIsEditing(false);
      }
    } catch (error) {
      onError(error);
    }
  };

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmitCreate({
    name
  }) {
    setIsUpdating(true);
    const tenantId = 'tenant:' + uuidv1();
    const dateCreatedAt = new Date();
    const tenantInput = {
      id: tenantId,
      dateCreatedAt,
      name
    }
    try {
      const data = await createTenant({
        variables: {
          tenant: tenantInput
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsCreating(false);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleSubmitUpdate({
    id,
    name
  }) {
    setIsUpdating(true);
    const tenantInputUpdate = {
      id,
      name
    }
    try {
      const data = await updateTenant({
        variables: {
          tenant: tenantInputUpdate
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleDelete(tenant) {
    const confirmed = window.confirm(`Do you want to delete tenant ${tenant ? tenant.name : ''}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteTenant({ variables: { tenantId: tenant.id } });
      } catch (error) {
        onError(error);
      }
      setIsDeleting(false);
      setIsEditing(false);
    } else {
      return null;
    }
  };


  if (isLoading || loading) {
    return(
      <div
        className='Loading'
      >
        {/* <ImSpinner2
          className='spinning'
        /> */}
      </div>
    )
  }

  return(
    <div>
      {((tenants && tenants.length) > 0) &&
        <div>
          <h6>
            My Organisations
          </h6>
          <hr/>
        </div>
      }
      {((tenants && tenants.length) > 0) &&
        tenants.map((tenant, index) => (
        <div key={tenant.id}>
          {(isEditing && tenant.id === tenantUpdate.id) ?
            (
              <Card
                bsPrefix={'shadow-lg p-3 bg-white rounded'}
              >
                <Card.Body>
                  <Card.Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                      <LoadingButton
                        style={{
                          margin: 4
                        }}
                        className='LoadingButton'
                        size='sm'
                        color='red'
                        variant='outline-danger'
                        disabled={isDeleting}
                        type='submit'
                        isLoading={isDeleting}
                        onClick={() => handleDelete(tenant)}
                      >
                        Delete
                      </LoadingButton>
                      <LoadingButton
                        style={{
                          margin: 4
                        }}
                        className='LoadingButton'
                        size='sm'
                        variant='outline-primary'
                        disabled={isUpdating || !validateForm({
                          id: tenantUpdate.id,
                        })}
                        type='submit'
                        isLoading={isUpdating}
                        onClick={() => handleSubmitUpdate(tenantUpdate)}
                      >
                        Save
                      </LoadingButton>
                      <LoadingButton
                        style={{
                          margin: 4
                        }}
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
                    </div>
                  </Card.Title>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4' className='font-weight-bold'>
                      <VscOrganization/>
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        // plaintext
                        // readOnly
                        value={tenantUpdate ? tenantUpdate.name : ''}
                        onChange={(event) => {
                          setTenantUpdate({
                            ...tenantUpdate,
                            name: event.target.value
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>
            ) : (
              <Card
                bsPrefix={(currentTenantId === tenant.id) ?
                  'shadow p-3 bg-white rounded' :
                  'shadow p-3 bg-white rounded'
                }
              >
                <Card.Body>
                  <Card.Title>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        minWidth: 240
                      }}
                    >
                      {/* <LoadingButton
                        style={{
                          margin: 4
                        }}
                        className='LoadingButton'
                        size='sm'
                        color='orange'
                        variant='outline-warning'
                        disabled={false}
                        type='submit'
                        isLoading={false}
                        onClick={(event) => {
                          setTenantUpdate({
                            id: tenant.id,
                            name: tenant.name
                          });
                          setIsEditing(true);
                        }}
                      >
                        Edit organization
                      </LoadingButton> */}
                      {(currentTenantId !== tenant.id) ?
                        (
                          <LoadingButton
                            style={{
                              margin: 4
                            }}
                            className='LoadingButton'
                            size='sm'
                            // color='green'
                            // variant='outline-warning'
                            disabled={false}
                            type='submit'
                            isLoading={isUpdating && ref.current === index}
                            onClick={async () => {
                              ref.current = index;
                              setIsUpdating(true);
                              await handleSubmitUpdateTenant(tenant);
                              await refreshToken();
                            }}
                          >
                            Select
                          </LoadingButton>
                        ) : (
                          <Badge pill variant="success">
                            {'Active'}
                          </Badge>
                        )
                      }
                    </div>
                  </Card.Title>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4' className='font-weight-bold'>
                      <VscOrganization/>
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        plaintext
                        readOnly
                        value={tenant ? tenant.name : ''}
                      />
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>
            )
          }
          <div
            style={{ margin: 20 }}
          />
        </div>
      ))}
      <hr/>
      {isCreating &&
        <Card
          bsPrefix={'shadow-lg p-3 bg-white rounded'}
        >
          <Card.Body>
            <Card.Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                {/* New tenant */}
                <LoadingButton
                  style={{
                    margin: 10
                  }}
                  className='LoadingButton'
                  size='sm'
                  variant='outline-primary'
                  disabled={isUpdating || !validateForm({
                    name: tenantCreate.name
                  })}
                  type='submit'
                  isLoading={isUpdating}
                  onClick={() => handleSubmitCreate(tenantCreate)}
                >
                  Save
                </LoadingButton>
                <LoadingButton
                  style={{
                    margin: 10
                  }}
                  className='LoadingButton'
                  size='sm'
                  variant='outline-secondary'
                  disabled={false}
                  type='submit'
                  isLoading={false}
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </LoadingButton>
              </div>
            </Card.Title>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                <VscOrganization/>
              </Form.Label>
              <Col sm='8'>
                {!isCreating ? (
                  <Form.Control
                    // plaintext
                    // readOnly
                    value={tenantCreate ? tenantCreate.name : ''}
                  />
                ) : (
                  <Form.Control
                    value={tenantCreate.name}
                    onChange={(event) => {
                      setTenantCreate({
                        ...tenantCreate,
                        name: event.target.value
                      });
                    }}
                  />
                )}
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
      }
      <Row className='justify-content-center'>
        {!isCreating ?
          (
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 20 }}
            >
              {/* {!currentTenantId &&
                <LoadingButton
                  style={{
                    margin: 10
                  }}
                  className='LoadingButton'
                  size='sm'
                  color='orange'
                  variant='outline-primary'
                  disabled={false}
                  type='submit'
                  isLoading={false}
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  Login as person
                </LoadingButton>
              } */}
              <LoadingButton
                style={{
                  margin: 10
                }}
                className='LoadingButton'
                size='sm'
                color='orange'
                variant='outline-primary'
                disabled={false}
                type='submit'
                isLoading={false}
                onClick={() => {
                  setIsCreating(true);
                }}
              >
                New organization
                {/* New tenant */}
              </LoadingButton>
            </div>
          ) : (
            <div
              style={{ margin: 10 }}
            />
          )
        }
      </Row>
    </div>
  )
};

export default TenantsOwn;