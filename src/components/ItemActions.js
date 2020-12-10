import React, { useState, useEffect } from "react";
// import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { v1 as uuidv1 } from 'uuid';
import { QUERY_getItemById, QUERY_listItems, QUERY_listEndUsers, QUERY_listLocations, QUERY_listActionTypes } from '../api/queries';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import Card from 'react-bootstrap/Card';
import { ImArrowUp2 } from 'react-icons/im';
import { BsThreeDots } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';
import { ImUser } from 'react-icons/im';
import { ImLocation } from 'react-icons/im';
import LoadingButton from './LoadingButton';
import './ItemActions.css'
// import { s3Delete } from '../libs/awsLib';
import { MUTATION_createAction, MUTATION_updateAction, MUTATION_deleteAction } from "../api/mutations";
import {
  getSortedDescendingByDateActionStart,
  isDateFuture,
  isDateToday,
  isDatePast
} from '../libs/fnsLib';
import { onError } from "../libs/errorLib";
import enGb from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGb);

function ItemActions({ actions=[], itemId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [actionCreate, setActionCreate] = useState({
    itemId,
    endUserId: '',
    locationId: '',
    dateActionStart: new Date(),
    dateActionEnd: '',
    actionTypeId: ''
  });
  const [createAction] = useMutation(MUTATION_createAction, {
    refetchQueries: [
      { query: QUERY_listItems },
      { query: QUERY_getItemById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionUpdate, setActionUpdate] = useState({});
  const [updateAction] = useMutation(MUTATION_updateAction, {
    refetchQueries: [
      { query: QUERY_listItems },
      { query: QUERY_getItemById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAction] = useMutation(MUTATION_deleteAction, {
    refetchQueries: [
      { query: QUERY_listItems },
      { query: QUERY_getItemById, variables: { itemId } }
    ],
    awaitRefetchQueries: true
  });
  const [endUserOption, setEndUserOption] = useState(null);
  const [endUserOptions, setEndUserOptions] = useState([]);
  const [listEndUsers, {
    data: dataEndUserOptions,
  }] = useLazyQuery(QUERY_listEndUsers, {
    fetchPolicy: 'cache-first'
  });
  const [locationOption, setLocationOption] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);
  const [listLocations, {
    data: dataLocationOptions,
  }] = useLazyQuery(QUERY_listLocations, {
    fetchPolicy: 'cache-first'
  });
  const [actionTypeOption, setActionTypeOption] = useState(null);
  const [actionTypeOptions, setActionTypeOptions] = useState([]);
  const [listActionTypes, {
    data: dataActionTypeOptions,
  }] = useLazyQuery(QUERY_listActionTypes, {
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
      try {
        listLocations();
        const data = dataLocationOptions && dataLocationOptions.listLocations;
        if (data) {
          const options = data.map(({ id, name }) => ({ value: id, label: name }));
          setLocationOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      try {
        listActionTypes();
        const data = dataActionTypeOptions && dataActionTypeOptions.listActionTypes;
        if (data) {
          const options = data.map(({ id, name }) => ({ value: id, label: name }));
          setActionTypeOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[listEndUsers, dataEndUserOptions, listLocations, dataLocationOptions, listActionTypes, dataActionTypeOptions]);

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmitCreate({
    itemId,
    endUserId,
    locationId,
    dateActionStart,
    dateActionEnd,
    actionTypeId
  }) {
    setIsUpdating(true);
    const actionId = 'action:' + uuidv1();
    const dateCreatedAt = new Date();
    const actionInput = {
      id: actionId,
      dateCreatedAt,
      itemId: itemId && ('action:' + itemId),
      endUserId: endUserId && ('action:' + endUserId),
      locationId: locationId && ('action:' + locationId),
      dateActionStart,
      dateActionEnd,
      actionTypeId: actionTypeId && ('action:' + actionTypeId)
    }
    try {
      const data = await createAction({
        variables: {
          action: actionInput
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsCreating(false);
        setEndUserOption(null);
        setLocationOption(null);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleSubmitUpdate({
    id,
    endUserId,
    locationId,
    dateActionStart,
    dateActionEnd,
    actionTypeId
  }) {
    setIsUpdating(true);
    const actionInputUpdate = {
      id,
      endUserId: endUserId && ('action:' + endUserId),
      locationId: locationId && ('action:' + locationId),
      dateActionStart,
      dateActionEnd,
      actionTypeId
    }
    try {
      const data = await updateAction({
        variables: {
          action: actionInputUpdate
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
        setEndUserOption(null);
        setLocationOption(null);
        setActionTypeOption(null);
      }
    } catch (error) {
      onError(error);
    }
  };

  async function handleDelete(action) {
    const confirmed = window.confirm(`Do you want to delete action${action.endUser ? ' by ' + action.endUser.name : ''}${action.location ? ' at ' + action.location.name : ''}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteAction({ variables: { actionId: action.id } });
      } catch (error) {
        onError(error);
      }
      setIsDeleting(false);
      setIsEditing(false);
    } else {
      return null;
    }
  };

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
      {isCreating &&
        <Card>
          <Card.Body>
            <Card.Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Next action
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-primary'
                    disabled={isUpdating || !validateForm({
                      endUserId: actionCreate.endUserId,
                      locationId: actionCreate.locationId,
                      actionTypeId: actionCreate.actionTypeId
                    })}
                    type='submit'
                    isLoading={isUpdating}
                    onClick={() => handleSubmitCreate(actionCreate)}
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
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </LoadingButton>
                </div>
              </div>
            </Card.Title>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                <ImUser/>
              </Form.Label>
              <Col sm='8'>
                {!isCreating ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={actionCreate.endUser ? actionCreate.endUser.name : ''}
                  />
                ) : (
                  <Select
                    isClearable={true}
                    value={endUserOption}
                    options={endUserOptions}
                    onChange={(option) => {
                      setEndUserOption(option);
                      setActionCreate({
                        ...actionCreate,
                        endUserId: option ? option.value : ''
                      });
                    }}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                <ImLocation/>
              </Form.Label>
              <Col sm='8'>
                {!isCreating ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={actionCreate.location ? actionCreate.location.name : ''}
                  />
                ) : (
                  <Select
                    isClearable={true}
                    value={locationOption}
                    options={locationOptions}
                    onChange={(option) => {
                      setLocationOption(option);
                      setActionCreate({
                        ...actionCreate,
                        locationId: option ? option.value : ''
                      });
                    }}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Action type
              </Form.Label>
              <Col sm='8'>
                {!isCreating ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={actionCreate.actionType ? actionCreate.actionType.name : ''}
                  />
                ) : (
                  <Select
                    isClearable={true}
                    value={actionTypeOption}
                    options={actionTypeOptions}
                    onChange={(option) => {
                      setActionTypeOption(option);
                      setActionCreate({
                        ...actionCreate,
                        actionTypeId: option ? option.value : ''
                      });
                    }}
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Action start
              </Form.Label>
              <Col sm='8'>
                <Form.Control as={DatePicker}
                  className="date-picker"
                  withPortal={true}
                  dateFormat='dd.MM.yyyy'
                  placeholderText='Select date'
                  locale='en-gb'
                  // todayButton='Today'
                  selected={actionCreate.dateActionStart && new Date(actionCreate.dateActionStart)}
                  onSelect={(date) => {
                    if (!date) {
                      setActionCreate({ ...actionCreate, dateActionStart: ''});
                      return null;
                    } else {
                      setActionCreate({ ...actionCreate, dateActionStart: date});
                    }
                  }}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                />
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
      }
      <Row className='justify-content-center'>
        {!isCreating ?
          (
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <LoadingButton
                className='LoadingButton'
                size='sm'
                color='orange'
                variant='outline-primary'
                disabled={false}
                type='submit'
                isLoading={false}
                onClick={() => {
                  setIsCreating(true);
                  setEndUserOption(null);
                  setLocationOption(null);
                  setActionTypeOption(null);
                }}
              >
                Next action
              </LoadingButton>
              <ImArrowUp2
                color={'lightblue'}
                style={{ margin: 10 }}
              />
            </div>
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
        getSortedDescendingByDateActionStart(actions).slice(0, actionsLimit).map((action, index) => (
        <div key={action.id}>
          {(isEditing && action.id === actionUpdate.id) ?
            (
              <Card
                bsPrefix={'shadow-lg p-3 bg-white rounded'}
              >
                <Card.Body>
                  <Card.Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {actionTypeOption && actionTypeOption.label}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                        <LoadingButton
                          className='LoadingButton'
                          size='sm'
                          color='red'
                          variant='outline-danger'
                          disabled={isDeleting}
                          type='submit'
                          isLoading={isDeleting}
                          onClick={() => handleDelete(action)}
                        >
                          Delete
                        </LoadingButton>
                        <LoadingButton
                          className='LoadingButton'
                          size='sm'
                          variant='outline-primary'
                          disabled={isUpdating || !validateForm({
                            id: actionUpdate.id,
                            endUserId: actionUpdate.endUserId,
                            locationId: actionUpdate.locationId,
                            actionTypeId: actionUpdate.actionTypeId,
                            dateActionStart: actionUpdate.dateActionStart
                          })}
                          type='submit'
                          isLoading={isUpdating}
                          onClick={() => handleSubmitUpdate(actionUpdate)}
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
                      </div>
                    </div>
                  </Card.Title>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      <ImUser/>
                    </Form.Label>
                    <Col sm='8'>
                      <Select
                        isClearable={true}
                        value={endUserOption}
                        options={endUserOptions}
                        onChange={(option) => {
                          setEndUserOption(option);
                          setActionUpdate({
                            ...actionUpdate,
                            id: action.id,
                            endUserId: option ? option.value : ''
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      <ImLocation/>
                    </Form.Label>
                    <Col sm='8'>
                      <Select
                        isClearable={true}
                        value={locationOption}
                        options={locationOptions}
                        onChange={(option) => {
                          setLocationOption(option);
                          setActionUpdate({
                            ...actionUpdate,
                            id: action.id,
                            locationId: option ? option.value : ''
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      Action type
                    </Form.Label>
                    <Col sm='8'>
                      <Select
                        isClearable={true}
                        value={actionTypeOption}
                        options={actionTypeOptions}
                        onChange={(option) => {
                          setActionTypeOption(option);
                          setActionUpdate({
                            ...actionUpdate,
                            id: action.id,
                            actionTypeId: option ? option.value : ''
                          });
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      Action start
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control as={DatePicker}
                        className="date-picker"
                        withPortal={true}
                        dateFormat='dd.MM.yyyy'
                        placeholderText='Select date'
                        locale='en-gb'
                        // todayButton='Today'
                        selected={actionUpdate.dateActionStart && new Date(actionUpdate.dateActionStart)}
                        onSelect={(date) => {
                          if (!date) {
                            setActionUpdate({ ...actionUpdate, dateActionStart: ''});
                            return null;
                          } else {
                            setActionUpdate({ ...actionUpdate, dateActionStart: date});
                          }
                        }}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="scroll"
                      />
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>
            ) : (
              <Card
                // className={'ItemActionToday'}
                bsPrefix={
                  isDateFuture(new Date(action.dateActionStart)) ?
                    'shadow p-3 bg-white rounded' :
                    (
                      isDateToday(new Date(action.dateActionStart)) ?
                        'shadow-lg p-3 bg-white rounded' :
                        (
                          isDatePast(new Date(action.dateActionStart)) ?
                            'shadow p-3 bg-light rounded' :
                            'shadow p-3 bg-light rounded'
                        )
                    )
                }
                // border={
                //   isDateFuture(new Date(action.dateActionStart)) ?
                //     'light' :
                //     (
                //       isDateToday(new Date(action.dateActionStart)) ?
                //         'success' :
                //         (
                //           isDatePast(new Date(action.dateActionStart)) ?
                //             'secondary' : 'light'
                //         )
                //     )
                // }
                // bg={'light'}
              >
                <Card.Body>
                  <Card.Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {action.actionType.name}
                      <LoadingButton
                        className='LoadingButton'
                        size='sm'
                        color='orange'
                        variant='outline-warning'
                        disabled={false}
                        type='submit'
                        isLoading={false}
                        onClick={() => {
                          setActionUpdate({
                            id: action.id,
                            endUserId: action.endUser && action.endUser.id,
                            locationId: action.location && action.location.id,
                            dateActionStart: action.dateActionStart
                          });
                          setEndUserOption(action.endUser ? {
                            value: action.endUser.id,
                            label: action.endUser.name
                          } : null);
                          setLocationOption(action.location ? {
                            value: action.location.id,
                            label: action.location.name
                          } : null);
                          setActionTypeOption(action.actionType ? {
                            value: action.actionType.id,
                            label: action.actionType.name
                          } : null);
                          setIsEditing(true);
                        }}
                      >
                        Edit
                      </LoadingButton>
                    </div>
                  </Card.Title>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      <ImUser/>
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        plaintext
                        readOnly
                        value={action.endUser ? action.endUser.name : ''}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      <ImLocation/>
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        plaintext
                        readOnly
                        value={action.location ? action.location.name : ''}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      Action type
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        plaintext
                        readOnly
                        value={action.actionType ? action.actionType.name : ''}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm=4'>
                      Action start
                    </Form.Label>
                    <Col sm='8'>
                      <Form.Control
                        plaintext
                        readOnly
                        value={action.dateActionStart ? new Date(action.dateActionStart).toLocaleDateString('de-DE') : ''}
                      />
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>
            )
          }
          <div
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {index < (actionsLimit - 1) && index < (actions.length - 1) ?
              (
                <ImArrowUp2
                  color='lightgrey'
                  style={{ justifySelf: 'center', margin: 10 }}
                />
              ) : (
                <>
                  {actionsLimit < actions.length &&
                    <BsThreeDots
                      color='lightgrey'
                      style={{ justifySelf: 'center', margin: 10 }}
                    />
                  }
                </>
              )
            }
          </div>
        </div>
      ))}
      <hr/>
    </div>
  )
};

export default ItemActions;