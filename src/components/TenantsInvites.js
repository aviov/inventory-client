import React, { useState, useEffect, useRef } from "react";
import {
  useLazyQuery,
  useMutation
} from '@apollo/client';
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
import { useUserContext, useAuthContext, useTenantContext } from "../libs/contextLib";
import {
  QUERY_listTenantsNotOwn,
  QUERY_listTenantUsers
} from "../api/queries";
import {
  MUTATION_inviteTenantUserAccept,
  // MUTATION_deleteTenantUser
} from "../api/mutations";
import { sliceStringAfter } from "../libs/fnsLib";
import { onError } from "../libs/errorLib";
import enGb from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGb);

function TenantsInvites() {
  const [isLoading, setIsLoading] = useState(true);
  const [tenantsNotOwn, setTenantsNotOwn] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const { currentUserName } = useUserContext();
  const refId = currentUserName && sliceStringAfter(currentUserName, ':');
  const { currentTenantId } = useTenantContext();
  const [listTenantsNotOwn, { loading, data }] = useLazyQuery(QUERY_listTenantsNotOwn, {
    variables: { prefix: null, refId }
  });
  const [isUpdating, setIsUpdating] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);
  // const [deleteTenantUser] = useMutation(MUTATION_deleteTenantUser, {
  //   refetchQueries: [{ query: QUERY_listTenantUsers }],
  //   awaitRefetchQueries: true
  // });
  const [inviteTenantUserAccept] = useMutation(MUTATION_inviteTenantUserAccept, {
    refetchQueries: [{ query: QUERY_listTenantsNotOwn }]
  });
  let ref = useRef(null);
  // const [tenantsNotOwnLimit] = useState(3);
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        listTenantsNotOwn();
        setTenantsNotOwn(data ? data.listTenantsNotOwn : []);
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[
    isAuthenticated,
    listTenantsNotOwn, data
  ]);

  async function handleSubmitAccept({
    id,
    emailVerified,
    inviteInfo: inviteInfoJSON,
  }) {
    setIsUpdating(true);
    const inviteInfo = JSON.parse(inviteInfoJSON);
    const dateAccept = new Date().toISOString();
    const inviteInfoUpdate = {
      ...inviteInfo,
      dateAccept
    };
    const inviteInfoUpdateJSON = JSON.stringify(inviteInfoUpdate);
    const tenantInputUpdate = {
      id,
      emailVerified,
      inviteInfo: inviteInfoUpdateJSON
    }
    try {
      const data = await inviteTenantUserAccept({
        variables: { tenantUser: tenantInputUpdate },
        awaitRefetchQueries: true,
        refetchQueries: [
          { 
            query: QUERY_listTenantsNotOwn,
            variables: { prefix: null, refId }
          },
          {
            query: QUERY_listTenantsNotOwn,
            variables: { prefix: null, refId: 'user:' + refId }
          },
          {
            query: QUERY_listTenantUsers
          }
        ]
      });
      if (data) {
        setIsUpdating(false);
      }
    } catch (error) {
      onError(error);
    }
  };

  // async function handleDelete(tenantUser) {
  //   const confirmed = window.confirm(`Do you want to decline to join ${tenantUser.name}?`);
  //   if (confirmed) {
  //     setIsDeleting(true);
  //     try {
  //       await deleteTenantUser({
  //         variables: { tenantUserId: tenantUser.id },
  //         awaitRefetchQueries: true,
  //         refetchQueries: [
  //           { 
  //             query: QUERY_listTenantsNotOwn,
  //             variables: { prefix: null, refId }
  //           }
  //         ]
  //       });
  //     } catch (error) {
  //       onError(error);
  //     }
  //     setIsDeleting(false);
  //   } else {
  //     return null;
  //   }
  // };


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
      {((tenantsNotOwn && tenantsNotOwn.length) > 0) &&
        <div>
          <h6>
            Invitations
          </h6>
          <hr/>
        </div>
      }
      {((tenantsNotOwn && tenantsNotOwn.length) > 0) &&
        tenantsNotOwn.map((tenant, index) => (
          <div key={tenant.id}>
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
                      variant='outline-danger'
                      disabled={isDeleting}
                      type='submit'
                      isLoading={isDeleting}
                      onClick={async () => {
                        await handleDelete(tenant);
                      }}
                    >
                      Decline
                    </LoadingButton> */}
                    {(currentTenantId !== tenant.id) ?
                      (
                        <LoadingButton
                          style={{
                            margin: 4
                          }}
                          className='LoadingButton'
                          size='sm'
                          color='orange'
                          variant='outline-success'
                          // disabled={true}
                          type='submit'
                          isLoading={isUpdating && ref.current === index}
                          onClick={async () => {
                            ref.current = index;
                            await handleSubmitAccept(tenant);
                          }}
                        >
                          Accept
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
          <div
            style={{ margin: 20 }}
          />
        </div>
      ))}
      {((tenantsNotOwn && tenantsNotOwn.length) > 0) &&
        <hr/>
      }
    </div>
  )
};

export default TenantsInvites;