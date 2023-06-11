import React, {
  // useEffect,
  useState
} from 'react'
import {
  useNavigate,
  // useParams
} from 'react-router-dom';
// import { ImSpinner2 } from 'react-icons/im';
import Form from 'react-bootstrap/Form';
import { v1 as uuidv1 } from 'uuid';
import {
  // useLazyQuery,
  useMutation
} from '@apollo/client'
import { MUTATION_createAction } from '../api/mutations'
import {
  QUERY_listActions
} from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import './ActionTemplForm.css';

function ActionTemplForm() {
  const navigate = useNavigate();
  // const { id: projectId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [valueUnitsA, setValueUnitsA] = useState('');
  const [valueUnitsB, setValueUnitsB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createAction] = useMutation(MUTATION_createAction, {
    refetchQueries: [{ query: QUERY_listActions, variables: { prefix: 'templ:' } }]
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
    const id = 'templ:action:' + uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    try {
      const actionCreated = await createAction({
        variables: {
          action: {
            id,
            name,
            description,
            dateCreatedAt,
            itemId: 'not_req',
            endUserId: 'not_req',
            locationId: 'not_req',
            valueUnitsA,
            valueUnitsB,
            dateActionStart: 'not_req',
            dateActionEnd: 'not_req',
            // index,
          }
        }
      })
      if (actionCreated) {
        setIsLoading(false);
        setName('');
        setDescription('');
        setValueUnitsA('');
        setValueUnitsB('');
        navigate.goBack();
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return(
    <div
      className='ActionTemplForm'
    >
      <Form>
        <Form.Group className='mb-3'>
          <Form.Label>
            Name
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Name'
            id={'name'}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Description
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Description'
            id={'description'}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Measure units A
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='pcs, m2, h, ...'
            id={'valueUnitsA'}
            value={valueUnitsA}
            onChange={(event) => setValueUnitsA(event.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            Measure units B
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='km, h, pcs, ...'
            id={'valueUnitsB'}
            value={valueUnitsB}
            onChange={(event) => setValueUnitsB(event.target.value)}
          />
        </Form.Group>
        <div className='d-grid gap-2'>
          <LoadingButton
            disabled={!validateForm({
              name,
              valueUnitsA,
              valueUnitsB
            })}
            type='submit'
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </div>
      </Form>
    </div>
  )
}

export default ActionTemplForm