import React, {
  // useEffect,
  useState
} from 'react'
import {
  useHistory,
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
  const history = useHistory();
  // const { id: projectId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [valueUnitsA, setValueUnitsA] = useState('');
  const [valueUnitsB, setValueUnitsB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createAction] = useMutation(MUTATION_createAction, {
    refetchQueries: [{ query: QUERY_listActions }]
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
    const id = 'actiontempl:' + uuidv1();
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
            valueUnitsA,
            valueUnitsB,
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
        history.goBack();
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <LoadingButton
          block
          disabled={!validateForm({
            // modelNumber,
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
      </Form>
    </div>
  )
}

export default ActionTemplForm