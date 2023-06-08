import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
import Form from 'react-bootstrap/Form';
import { v1 as uuidv1 } from 'uuid';
import { useLazyQuery, useMutation } from '@apollo/client'
import { QUERY_listActionTypes } from '../api/queries';
import { MUTATION_createActionType } from '../api/mutations'
import LoadingButton from './LoadingButton';
import {
  getIsDisabledVisibleLatest,
  getIsDisabledVisibleNext
} from '../libs/fnsLib';
import { onError } from '../libs/errorLib';
import './ActionTypeForm.css';

function ActionTypeForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isVisibleLatest, setIsVisibleLatest] = useState(false);
  const [isVisibleNext, setIsVisibleNext] = useState(false);
  const [isDisabledVisibleLatest, setIsDisabledVisibleLatest] = useState(false);
  const [isDisabledVisibleNext, setIsDisabledVisibleNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listActionTypes, { data, loading }] = useLazyQuery(QUERY_listActionTypes);
  const [createActionType] = useMutation(MUTATION_createActionType, {
    refetchQueries: [{ query: QUERY_listActionTypes }]
  });

  useEffect(() => {
    function onLoad() {
      try {
        listActionTypes();
        const actionTypes = data ? data.listActionTypes : [];
        setIsDisabledVisibleLatest(getIsDisabledVisibleLatest(actionTypes));
        setIsDisabledVisibleNext(getIsDisabledVisibleNext(actionTypes));
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  },[listActionTypes, data, isDisabledVisibleLatest, isDisabledVisibleNext]);

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const id = 'actiontype:' + uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    try {
      const actionTypeCreated = await createActionType({
        variables: {
          actionType: {
            id,
            dateCreatedAt,
            name,
            isVisibleLatest,
            isVisibleNext
          }
        }
      })
      if (actionTypeCreated) {
        setIsLoading(false);
        setName('');
        navigate('/actionTypes');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  if (loading) {
    return(
      <div
        className='Loading'
      >
        <ImSpinner2
          className='spinning'
        />
      </div>
    )
  };

  return(
    <div
      className='ActionTypeForm'
    >
      <Form>
        <Form.Group>
          <Form.Label>
            Name
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Show latest action in table
          </Form.Label>
          <Form.Check
            type='switch'
            id='isVisibleLatest'
            disabled={isDisabledVisibleLatest}
            // label='Visible latest'
            checked={isVisibleLatest ? true : false}
            onChange={() => setIsVisibleLatest(isVisibleLatest ? false : true)}
          />
          <Form.Label>
            Show next action in table
          </Form.Label>
          <Form.Check
            type='switch'
            id='isVisibleNext'
            disabled={isDisabledVisibleNext}
            // label='Visible latest'
            checked={isVisibleNext ? true : false}
            onChange={() => setIsVisibleNext(isVisibleNext ? false : true)}
          />
        </Form.Group>
        <LoadingButton
          // block
          disabled={!validateForm({
            name
          })}
          type='submit'
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Form>
    </div>
  )
}

export default ActionTypeForm