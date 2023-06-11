import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getOrgById, QUERY_listOrgs } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ImSpinner2 } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import EndUsers from "./EndUsers";
import './OrgInfo.css'
import { MUTATION_deleteOrg, MUTATION_updateOrg } from "../api/mutations";
import { onError } from "../libs/errorLib";

function OrgInfo({ prefix, prefixType }) {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [org, setOrg] = useState({
    id,
    name: '',
    email: '',
    phone: '',
    webPage: '',
    city: '',
    country: '',
  });
  const [orgUpdate, setOrgUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getOrgById, { data, loading }] = useLazyQuery(QUERY_getOrgById);
  const [updateOrg] = useMutation(MUTATION_updateOrg);
  const [deleteOrg] = useMutation(MUTATION_deleteOrg, {
    refetchQueries: [
      {
        query: QUERY_listOrgs,
        variables: { prefix }
      }
    ]
  });
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        getOrgById({
          variables: { orgId: id }
        });
        const orgById = data && data.getOrgById;
        if (orgById) {
          const {
            id,
            name,
            email,
            phone,
            webPage,
            country,
            city,
          } = orgById;
          setOrg(orgById);
          setOrgUpdate({
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
  },[isAuthenticated, getOrgById, id, data]);

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
      const data = await updateOrg({
        variables: {
          org: {
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

  async function handleDelete(org) {
    const confirmed = window.confirm(`Do you want to delete item type ${org.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteOrg({ variables: { orgId: id } });
        navigate.goBack();
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
      className='OrgInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <Row className='justify-content-end'>
              {!isDetailsVisible ? 
                (
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-primary'
                    disabled={false}
                    type='submit'
                    isLoading={false}
                    onClick={() => setIsDetailsVisible(true)}
                  >
                    Show more
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-secondary'
                    disabled={false}
                    type='submit'
                    isLoading={false}
                    onClick={() => setIsDetailsVisible(false)}
                  >
                    Show less
                  </LoadingButton>
                )
              }
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
                      onClick={() => handleDelete(org)}
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
                      onClick={() => handleSubmit(orgUpdate)}
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
                    value={org.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={orgUpdate.name}
                    onChange={(event) => setOrgUpdate({ ...orgUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            {isDetailsVisible &&
              <>
                <Form.Group className='mb-3' as={Row}>
                  <Form.Label column='sm=4' className='font-weight-bold'>
                    Email
                  </Form.Label>
                  <Col sm='8'>
                    {!isEditing ? (
                      <Form.Control
                        plaintext
                        readOnly
                        value={org.email}
                      />
                    ) : (
                      <Form.Control
                        type='text'
                        placeholder='Email'
                        value={orgUpdate.email}
                        onChange={(event) => setOrgUpdate({ ...orgUpdate, email: event.target.value })}
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
                        value={org.phone}
                      />
                    ) : (
                      <Form.Control
                        type='text'
                        placeholder='Phone'
                        value={orgUpdate.phone}
                        onChange={(event) => setOrgUpdate({ ...orgUpdate, phone: event.target.value })}
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
                        value={org.webPage}
                      />
                    ) : (
                      <Form.Control
                        type='text'
                        placeholder='Web page'
                        value={orgUpdate.webPage}
                        onChange={(event) => setOrgUpdate({ ...orgUpdate, webPage: event.target.value })}
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
                        value={org.city}
                      />
                    ) : (
                      <Form.Control
                        type='text'
                        placeholder='City'
                        value={orgUpdate.city}
                        onChange={(event) => setOrgUpdate({ ...orgUpdate, city: event.target.value })}
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
                        value={org.country}
                      />
                    ) : (
                      <Form.Control
                        type='text'
                        placeholder='Country'
                        value={orgUpdate.country}
                        onChange={(event) => setOrgUpdate({ ...orgUpdate, country: event.target.value })}
                      />
                    )}
                  </Col>
                </Form.Group>
              </>
            }
            <hr style={{ marginBottom: 30 }}/>
          </Col>
        </Row>
        <Row>
          <div
          >
            <EndUsers
              prefix={`org:enduser::${id}:`}
              prefixType={'customers'}
              parentId={id}
              hideButtons={true}
            />
          </div>
          <Button
            disabled={loading}
            className='AddEndUserButton'
            size='sm'
            variant='outline-primary'
            title='Add EndUser'
            onClick={() => navigate(`/${prefixType}/${org.id}/endUsers/new`)}
          >
            Add person
            {/* Add end user */}
          </Button>
        </Row>
      </Container>
    </div>
  )
}

export default OrgInfo