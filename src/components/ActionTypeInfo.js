import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getActionTypeById, QUERY_listActionTypes } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { ImCheckmark } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import './ActionTypeInfo.css'
import { MUTATION_deleteActionType, MUTATION_updateActionType } from "../api/mutations";
import {
  getIsDisabledVisibleLatest,
  getIsDisabledVisibleNext
} from '../libs/fnsLib';
import { onError } from "../libs/errorLib";

function ActionTypeInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [actionType, setActionType] = useState({
    id,
    name: '',
    isVisibleLatest: false,
    isVisibleNext: false
  });
  const [actionTypeUpdate, setActionTypeUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getActionTypeById, { data, loading }] = useLazyQuery(QUERY_getActionTypeById);
  const [updateActionType] = useMutation(MUTATION_updateActionType);
  const [deleteActionType] = useMutation(MUTATION_deleteActionType, {
    refetchQueries: [{ query: QUERY_listActionTypes }]
  });
  const [listActionTypes, { data: dataListActionTypes }] = useLazyQuery(QUERY_listActionTypes);
  const [isDisabledVisibleLatest, setIsDisabledVisibleLatest] = useState(false);
  const [isDisabledVisibleNext, setIsDisabledVisibleNext] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      setIsLoading(true);
      try {
        getActionTypeById({
          variables: { actionTypeId: id }
        });
        const actionTypeById = data && data.getActionTypeById;
        // console.log(data);
        if (actionTypeById) {
          const {
            id,
            name,
            isVisibleLatest,
            isVisibleNext
          } = actionTypeById;
          setActionType(actionTypeById);
          setActionTypeUpdate({
            id,
            name,
            isVisibleLatest,
            isVisibleNext
          });
        }
      } catch (error) {
        onError(error);
      }
      try {
        listActionTypes();
        const actionTypes = dataListActionTypes ? dataListActionTypes.listActionTypes : [];
        setIsDisabledVisibleLatest(getIsDisabledVisibleLatest(actionTypes));
        setIsDisabledVisibleNext(getIsDisabledVisibleNext(actionTypes));
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getActionTypeById, id, data, listActionTypes, dataListActionTypes]);

  async function handleSubmit({
    id,
    name,
    isVisibleLatest,
    isVisibleNext
  }) {
    setIsUpdating(true);
    try {
      const data = await updateActionType({
        variables: {
          actionType: {
            id,
            name,
            isVisibleLatest,
            isVisibleNext
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

  // console.log(typeof actionType.dateWarrantyBegins);
  // console.log(actionType.dateWarrantyBegins)
  // console.log(actionType.dateWarrantyExpires)


  async function handleDelete(actionType) {
    const confirmed = window.confirm(`Do you want to delete item type ${actionType.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteActionType({ variables: { actionTypeId: id } });
        history.push('/actionTypes');
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
  // const actionType = data.getActionTypeById;
  // console.log(actionTypeUpdate);
  return(
    <div
      className='ActionTypeInfo'
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
                      onClick={() => handleDelete(actionType)}
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
                      onClick={() => handleSubmit(actionTypeUpdate)}
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
                    value={actionType.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={actionTypeUpdate.name}
                    onChange={(event) => setActionTypeUpdate({ ...actionTypeUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='align-items-center'>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Latest action is visible
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <>
                    {actionType.isVisibleLatest &&
                      <ImCheckmark as={Form.Control}/>
                    }
                  </>
                ) : (
                  <Form.Check
                    type='switch'
                    id='isVisibleLatest'
                    disabled={isDisabledVisibleLatest && actionType.isVisibleLatest === false}
                    checked={actionTypeUpdate.isVisibleLatest ? true : false}
                    onChange={() => setActionTypeUpdate({ ...actionTypeUpdate, isVisibleLatest: (actionTypeUpdate.isVisibleLatest ? false : true) })}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='align-items-center'>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Next action is visible
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <>
                    {actionType.isVisibleNext &&
                      <ImCheckmark as={Form.Control}/>
                    }
                  </>
                ) : (
                  <Form.Check
                    type='switch'
                    id='isVisibleNext'
                    disabled={isDisabledVisibleNext && actionType.isVisibleNext === false}
                    checked={actionTypeUpdate.isVisibleNext ? true : false}
                    onChange={() => setActionTypeUpdate({ ...actionTypeUpdate, isVisibleNext: (actionTypeUpdate.isVisibleNext ? false : true) })}
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

export default ActionTypeInfo