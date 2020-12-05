import React, { useState, useEffect } from "react";
// import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { v1 as uuidv1 } from 'uuid';
import { QUERY_getItemById, QUERY_listItems, QUERY_listEndUsers } from '../api/queries';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
// import DatePicker, { registerLocale } from 'react-datepicker';
import Card from 'react-bootstrap/Card';
import { ImArrowUp2 } from 'react-icons/im';
import { ImSpinner2 } from 'react-icons/im';
import LoadingButton from './LoadingButton';
import './ItemActions.css'
// import { s3Delete } from '../libs/awsLib';
import { MUTATION_createAction } from "../api/mutations";
import { onError } from "../libs/errorLib";
// import enGb from 'date-fns/locale/en-GB';
// registerLocale('en-gb', enGb);

function ItemActions({ actions=[], itemId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [createAction] = useMutation(MUTATION_createAction, {
    refetchQueries: [
      { query: QUERY_listItems },
      { query: QUERY_getItemById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });
  const [action, setAction] = useState({
    itemId,
    endUserId: '',
    dateActionStart: '',
    dateActionEnd: '',
  });
  const [endUserOption, setEndUserOption] = useState(null);
  const [endUserOptions, setEndUserOptions] = useState([]);
  const [listEndUsers, {
    data: dataEndUserOptions,
  }] = useLazyQuery(QUERY_listEndUsers, {
    fetchPolicy: 'cache-first'
  });
  const [actionsLimit] = useState(3);
  
  useEffect(() => {
    function onLoad() {
      setIsLoading(true);
      try {
        listEndUsers();
        const data = dataEndUserOptions && dataEndUserOptions.listEndUsers;
        if (data) {
          const options = data.map(({ id, name }) => ({ value: id, label: name }));
          setEndUserOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[listEndUsers, dataEndUserOptions]);

  async function handleSubmitMove({
    itemId,
    endUserId,
    dateActionStart,
    dateActionEnd
  }) {
    setIsUpdating(true);
    const actionId = 'action:' + uuidv1();
    const dateCreatedAt = new Date();
    const actionInput = {
      id: actionId,
      dateCreatedAt,
      itemId: itemId && ('action:' + itemId),
      endUserId: endUserId && ('action:' + endUserId),
      dateActionStart,
      dateActionEnd
    }
    // console.log(actionInput);
    try {
      const data = await createAction({
        variables: {
          action: actionInput
        }
      });
      console.log('data', data);
      if (data) {
        setIsUpdating(false);
        setIsMoving(false);
        setEndUserOption(null)
      }
    } catch (error) {
      onError(error);
    }
  }

  function compareByDate(a, b) {
    if (a.dateCreatedAt < b.dateCreatedAt) { return 1 }
    if (a.dateCreatedAt > b.dateCreatedAt) { return -1 }
    return 0;
  }

  if (isLoading) {
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
    <div>
      {isMoving &&
        <Card>
          <Card.Body>
            <Card.Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Next use
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-primary'
                    disabled={isUpdating}
                    type='submit'
                    isLoading={isUpdating}
                    onClick={() => handleSubmitMove(action)}
                  >
                    Confirm
                  </LoadingButton>
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-secondary'
                    disabled={false}
                    type='submit'
                    isLoading={false}
                    onClick={() => setIsMoving(false)}
                  >
                    Cancel
                  </LoadingButton>
                </div>
              </div>
            </Card.Title>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                End user
              </Form.Label>
              <Col sm='8'>
                {!isMoving ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={action.endUser ? action.endUser.name : ''}
                  />
                ) : (
                  <Select
                    isClearable={true}
                    value={endUserOption}
                    options={endUserOptions}
                    onChange={(option) => {
                      setEndUserOption(option);
                      setAction({
                        ...action,
                        endUserId: option ? option.value : ''
                      });
                    }}
                  />
                )}
              </Col>
            </Form.Group>
            {/* <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Location
              </Form.Label>
              <Col sm='8'>
                {!isMoving ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={action.location ? action.location.name : ''}
                  />
                ) : (
                  <Select
                    isClearable={true}
                    value={locationOption}
                    options={locationOptions}
                    onChange={(option) => {
                      setLocationOption(option);
                      setAction({ ...action, locationId: option ? option.value : '' });
                    }}
                  />
                )}
              </Col>
            </Form.Group> */}
          </Card.Body>
        </Card>
      }
      <Row className='justify-content-center'>
        {!isMoving ?
          (
            <LoadingButton
              className='LoadingButton'
              size='sm'
              color='orange'
              variant='outline-primary'
              disabled={false}
              type='submit'
              isLoading={false}
              onClick={() => setIsMoving(true)}
            >
              {/* <ImArrowUp2/> */}
              Next use
            </LoadingButton>
          ) : (
            <div
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <ImArrowUp2
                color={'lightblue'}
                style={{ justifySelf: 'center', margin: 10 }}
              />
            </div>
          )
        }
      </Row>
      {(actions.length > 0) &&
        actions.slice().sort((a, b) => compareByDate(a, b)).slice(0, actionsLimit).map((action, index) => (
        <div key={action.id}>
          <Card
            border={index === 0 ? 'secondary' : 'light'}
            bg={'light'}
          >
            <Card.Body>
              <Card.Title>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {index === 0 ? 'Using now' : 'Used before'}
                </div>
              </Card.Title>
              <Form.Group as={Row}>
                <Form.Label column='sm=4'>
                  End user
                </Form.Label>
                <Col sm='8'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={action.endUser ? action.endUser.name : ''}
                  />
                </Col>
              </Form.Group>
              {/* <Form.Group as={Row}>
                <Form.Label column='sm=4'>
                  Location
                </Form.Label>
                <Col sm='8'>
                  <Form.Control
                    plaintext
                    readOnly
                    value={action.location ? action.location.name : ''}
                  />
                </Col>
              </Form.Group> */}
            </Card.Body>
          </Card>
          {index < (actionsLimit - 1) &&
            <div
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <ImArrowUp2
                color='lightgrey'
                style={{ justifySelf: 'center', margin: 10 }}
              />
            </div>
          }
        </div>
      ))}
    </div>
  )
};

export default ItemActions;