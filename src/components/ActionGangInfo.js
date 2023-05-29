import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  QUERY_getActionGangById,
  // QUERY_listActionGangTypes,
  QUERY_listActionGangs
} from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import './ActionGangInfo.css'
import { MUTATION_deleteActionGang, MUTATION_updateActionGang } from "../api/mutations";
import { onError } from "../libs/errorLib";

function ActionGangInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [actionGang, setActionGang] = useState({
    id,
    name: '',
    description: '',
    valueUnitsA: '',
    valueUnitsB: ''
  });
  const [actionGangUpdate, setActionGangUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getActionGangById, { data, loading }] = useLazyQuery(QUERY_getActionGangById);
  const [updateActionGang] = useMutation(MUTATION_updateActionGang);
  const [deleteActionGang] = useMutation(MUTATION_deleteActionGang, {
    refetchQueries: [{ query: QUERY_listActionGangs }]
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      setIsLoading(true);
      try {
        getActionGangById({
          variables: { actionGangId: id }
        });
        const actionGangById = data && data.getActionGangById;
        // console.log(data);
        if (actionGangById) {
          const {
            id,
            name,
            description,
            valueUnitsA,
            valueUnitsB
          } = actionGangById;
          setActionGang(actionGangById);
          setActionGangUpdate({
            id,
            name,
            description,
            valueUnitsA,
            valueUnitsB
          });
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getActionGangById, id, data]);

  async function handleSubmit({
    id,
    name,
    description,
    valueUnitsA,
    valueUnitsB
  }) {
    setIsUpdating(true);
    try {
      const data = await updateActionGang({
        variables: {
          actionGang: {
            id,
            name,
            description,
            valueUnitsA,
            valueUnitsB
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

  async function handleDelete(actionGang) {
    const confirmed = window.confirm(`Do you want to delete actionGang ${actionGang.name}, SN: ${actionGang.description}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteActionGang({ variables: { actionGangId: id } });
        history.push('/actionGangs');
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
  // const actionGang = data.getActionGangById;
  // console.log(actionGang);

  return(
    <div
      className='ActionGangInfo'
    >
      <Container
        fluid
      >
        <Row>
          <Col lg='2'
            // breakpoints={['md', 'sm', 'xs']}
          >
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
                      disabled={isDeleting || (actionGang.actions && actionGang.actions.length > 0)}
                      type='submit'
                      isLoading={isDeleting}
                      onClick={() => handleDelete(actionGang)}
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
                      onClick={() => handleSubmit(actionGangUpdate)}
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
                    value={actionGang.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={actionGangUpdate.name}
                    onChange={(event) => setActionGangUpdate({ ...actionGangUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Description
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={actionGang.description}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Description'
                    value={actionGangUpdate.description}
                    onChange={(event) => setActionGangUpdate({ ...actionGangUpdate, description: event.target.value})}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Measure units A
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={actionGang.valueUnitsA || ''}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='ValueUnitsA'
                    value={actionGangUpdate.valueUnitsA || ''}
                    onChange={(event) => setActionGangUpdate({ ...actionGangUpdate, valueUnitsA: event.target.value})}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Measure units B
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={actionGang.valueUnitsB || ''}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='ValueUnitsB'
                    value={actionGangUpdate.valueUnitsB || ''}
                    onChange={(event) => setActionGangUpdate({ ...actionGangUpdate, valueUnitsB: event.target.value})}
                  />
                )}
              </Col>
            </Form.Group>
            <hr/>
            <hr style={{ marginBottom: 30 }}/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ActionGangInfo