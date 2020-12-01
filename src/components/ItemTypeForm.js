import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { v1 as uuidv1 } from 'uuid';
import { useMutation } from '@apollo/client'
import { MUTATION_createItemType } from '../api/mutations'
import { QUERY_listItemTypes } from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import './ItemTypeForm.css';

function ItemTypeForm() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createItemType] = useMutation(MUTATION_createItemType, {
    refetchQueries: [{ query: QUERY_listItemTypes }]
  });

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const id = 'itemtype:' + uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    // console.log(
    //   'id', id,
    //   'dateCreatedAt', dateCreatedAt
    // )
    try {
      const itemTypeCreated = await createItemType({
        variables: {
          itemType: {
            id,
            name,
            dateCreatedAt
          }
        }
      })
      if (itemTypeCreated) {
        setIsLoading(false);
        setName('');
        history.push('/itemTypes');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  // console.log(files);
  return(
    <div
      className='ItemTypeForm'
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
        <LoadingButton
          block
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

export default ItemTypeForm