import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getGroupById, QUERY_listGroups } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import GroupEndUsers from './GroupEndUsers';
import './GroupInfo.css'
import {
  MUTATION_deleteGroup,
  MUTATION_updateGroup
} from "../api/mutations";
// import validator from 'validator';
import { onError } from "../libs/errorLib";

function GroupInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [group, setGroup] = useState({
    id,
    regNr: '',
    name: '',
    email: '',
    phone: '',
    webPage: '',
    endUserInfos: []
  });
  const [groupUpdate, setGroupUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getGroupById, { data, loading }] = useLazyQuery(QUERY_getGroupById);
  const [updateGroup] = useMutation(MUTATION_updateGroup);
  const [deleteGroup] = useMutation(MUTATION_deleteGroup, {
    refetchQueries: [{ query: QUERY_listGroups }]
  });
  
  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        getGroupById({
          variables: { groupId: id }
        });
        const groupById = data && data.getGroupById;
        if (groupById) {
          const {
            id,
            name,
            regNr,
            email,
            phone,
            webPage,
            endUserInfos
          } = groupById;
          setGroup(groupById);
          setGroupUpdate({
            id,
            name,
            regNr,
            email,
            phone,
            webPage,
            endUserInfos
          });
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getGroupById, id, data]);

  async function handleSubmit({
    id,
    name,
    regNr,
    email,
    phone,
    webPage
  }) {
    setIsUpdating(true);
    try {
      const data = await updateGroup({
        variables: {
          group: {
            id,
            name,
            regNr,
            email,
            phone,
            webPage
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

  async function handleDelete(group) {
    const confirmed = window.confirm(`Do you want to delete group ${group.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteGroup({ variables: { groupId: id } });
        navigate('/groups');
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
      className='GroupInfo'
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
                      onClick={() => handleDelete(group)}
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
                      onClick={() => handleSubmit(groupUpdate)}
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
              <Form.Label column='sm=4' className='font-weight-bold'>
                Name
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={group.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={groupUpdate.name}
                    onChange={(event) => setGroupUpdate({ ...groupUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Reg nr
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={group.regNr}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Web page'
                    value={groupUpdate.regNr}
                    onChange={(event) => setGroupUpdate({ ...groupUpdate, regNr: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Email
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={group.email}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Email that exist'
                    value={groupUpdate.email}
                    onChange={(event) => setGroupUpdate({ ...groupUpdate, email: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Phone
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={group.phone}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Phone'
                    value={groupUpdate.phone}
                    onChange={(event) => setGroupUpdate({ ...groupUpdate, phone: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Web page
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={group.webPage}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Web page'
                    value={groupUpdate.webPage}
                    onChange={(event) => setGroupUpdate({ ...groupUpdate, webPage: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <hr style={{ marginBottom: 30 }}/>
            <GroupEndUsers
              endUserInfos={group.endUserInfos}
              groupId={id}
              groupName={group.name}
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default GroupInfo