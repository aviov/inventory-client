import React, { useState, useEffect } from "react";
// import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { v1 as uuidv1 } from 'uuid';
import { QUERY_listEndUsers } from '../api/queries';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
// import Modal from 'react-bootstrap/Modal';
// import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { BsThreeDots } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';
import { ImUser } from 'react-icons/im';
import LoadingButton from './LoadingButton';
import Select from 'react-select';
import './GroupEndUsers.css'
// import { s3Delete } from '../libs/awsLib';
import {
  MUTATION_inviteEndUserRequest,
  // MUTATION_updateEndUserInfo,
  MUTATION_deleteEndUserInfo
} from "../api/mutations";
import {
  QUERY_getGroupById
} from '../api/queries';
import { useUserContext } from '../libs/contextLib';
import { onError } from "../libs/errorLib";

function GroupEndUsers({ endUserInfos=[], groupId, groupName }) {
  const [isLoading, setIsLoading] = useState(true);
  // const [isEditing, setIsEditing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [endUserInvite, setEndUserInvite] = useState({});
  const [inviteEndUserRequest] = useMutation(MUTATION_inviteEndUserRequest, {
    refetchQueries: [
      { query: QUERY_getGroupById, variables: { groupId } }
    ],
    awaitRefetchQueries: true
  });
  const [isUpdating, setIsUpdating] = useState(false);
  // const [endUserUpdate, setEndUserUpdate] = useState({});
  // const [updateEndUserInfo] = useMutation(MUTATION_updateEndUserInfo);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteEndUserInfo] = useMutation(MUTATION_deleteEndUserInfo, {
    refetchQueries: [
      { query: QUERY_getGroupById, variables: { groupId } }
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
  const { currentUserName } = useUserContext();
  const currentUserEmail = currentUserName;
  const [endUserInfosLimit] = useState(7);
  
  useEffect(() => {
    function onLoad() {
      setIsLoading(true);
      try {
        listEndUsers();
        const data = dataEndUserOptions && dataEndUserOptions.listEndUsers;
        if (data) {
          const endUsers = data.map(({ id, name, email, phone }) =>
            ({ value: id, label: name, id, name, email, phone }));
          const options = endUsers.filter(({ id }) => 
            !(endUserInfos.find(({ endUser }) => endUser.id === id)));
          setEndUserOptions(options);
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[listEndUsers, dataEndUserOptions, endUserInfos]);

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmitInvite({
    endUserId,
    groupId,
    invitedBy
  }) {
    setIsUpdating(true);
    const endUserInfoId = 'enduserinfo:' + uuidv1();
    const dateCreatedAt = new Date();
    const dateInvitedAt = new Date();
    const inviteInfo = {
      nameInvitedBy: 'Inviting Person',
      emailInvitedBy: currentUserEmail,
      groupInvitedTo: groupName,
      nameInvited: endUserInvite.name,
      emailInvited: endUserInvite.email
    };
    const inviteInfoJSON = JSON.stringify(inviteInfo);
    const endUserInfoInput = {
      id: endUserInfoId,
      dateCreatedAt,
      endUserId: endUserId && ('enduserinfo:' + endUserId), 
      groupId: groupId && ('enduserinfo:' + groupId),
      invitedBy,
      dateInvitedAt,
      inviteInfo: inviteInfoJSON
    }
    try {
      const data = await inviteEndUserRequest({
        variables: {
          endUserInfo: endUserInfoInput
        }
      });
      if (data) {
        setIsUpdating(false);
        setIsInviting(false);
        setEndUserOption(null);
      }
    } catch (error) {
      onError(error);
    }
  };

  // async function handleSubmitConfirm({
  //   id,
  //   confirmedBy,
  // }) {
  //   setIsUpdating(true);
  //   const dateConfirmedAt = new Date();
  //   const endUserInputUpdate = {
  //     id,
  //     confirmedBy,
  //     dateConfirmedAt
  //   }
  //   try {
  //     const data = await updateEndUserInfo({
  //       variables: {
  //         endUser: endUserInputUpdate
  //       }
  //     });
  //     if (data) {
  //       setIsUpdating(false);
  //       setIsEditing(false);
  //       setEndUserOption(null);
  //     }
  //   } catch (error) {
  //     onError(error);
  //   }
  // };

  async function handleDelete(endUserInfo) {
    const confirmed = window.confirm(`Do you want to exclude end user ${endUserInfo.endUser ? endUserInfo.endUser.name : ''} from this group?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteEndUserInfo({ variables: { endUserInfoId: endUserInfo.id } });
      } catch (error) {
        onError(error);
      }
      setIsDeleting(false);
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
    <div
      className='GroupEndUsers'
    >
      {isInviting &&
        <Card
          className='Card'
          bsPrefix={'shadow-lg p-3 bg-white rounded'}
        >
          <Card.Body>
            <Card.Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Invite end user
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-primary'
                    disabled={isUpdating || !validateForm({
                      groupId,
                      endUserId: endUserInvite.endUserId,
                    })}
                    type='submit'
                    isLoading={isUpdating}
                    onClick={() => handleSubmitInvite(endUserInvite)}
                  >
                    Invite
                  </LoadingButton>
                  <LoadingButton
                    className='LoadingButton'
                    size='sm'
                    variant='outline-secondary'
                    disabled={false}
                    type='submit'
                    isLoading={false}
                    onClick={() => {
                      setIsUpdating(false);
                      setIsInviting(false);
                      setEndUserInvite({});
                      setEndUserOption(null);
                    }}
                  >
                    Cancel
                  </LoadingButton>
                </div>
              </div>
            </Card.Title>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                <ImUser/>
              </Form.Label>
              <Col sm='8'>
                <Select
                  isClearable={true}
                  value={endUserOption}
                  options={endUserOptions}
                  onChange={(option) => {
                    setEndUserOption(option);
                    setEndUserInvite({
                      ...endUserInvite,
                      groupId,
                      endUserId: option ? option.value : '',
                      name: option ? option.name : '',
                      email: option ? option.email : '',
                      phone: option ? option.phone : ''
                    });
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Email
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  value={endUserInvite.email || ''}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
                Phone
              </Form.Label>
              <Col sm='8'>
                <Form.Control
                  plaintext
                  readOnly
                  value={endUserInvite.phone || ''}
                />
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
      }
      <Row className='justify-content-center'>
        {!isInviting &&
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
                setIsInviting(true);
                setEndUserOption(null);
              }}
            >
              Invite end user
            </LoadingButton>
          </div>
        }
      </Row>
      {(endUserInfos.length > 0) &&
        endUserInfos.map(({ id, endUser, dateConfirmedAt }, index) => (
          <div key={id}>
            <Card
              className='Card'
              bsPrefix={'shadow p-3 bg-white rounded'}
            >
              <Card.Body>
                <Card.Title 
                  className="d-flex justify-content-between align-items-center"
                >
                  {endUser.name}
                  {!dateConfirmedAt ? (
                    <Badge
                      variant="warning"
                      className='font-weight-light'
                    >
                      Not confirmed
                    </Badge>
                  ) : (
                    <div>
                      <LoadingButton
                        className='LoadingButton'
                        size='sm'
                        variant='outline-secondary'
                        disabled={isDeleting}
                        type='submit'
                        isLoading={isDeleting}
                        onClick={() => handleDelete({ id, endUser })}
                      >
                        Exclude
                      </LoadingButton>
                    </div>
                  )}
                </Card.Title>
                <Form.Group as={Row}>
                  <Form.Label column='sm=4' className='font-weight-bold'>
                    Email
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      plaintext
                      readOnly
                      value={endUser.email || ''}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column='sm=4' className='font-weight-bold'>
                    Phone
                  </Form.Label>
                  <Col sm='8'>
                    <Form.Control
                      plaintext
                      readOnly
                      value={endUser.phone || ''}
                    />
                  </Col>
                </Form.Group>
              </Card.Body>
            </Card>
          <div
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {!(index < (endUserInfosLimit - 1) && index < (endUserInfos.length - 1)) &&
              <>
                {endUserInfosLimit < endUserInfos.length &&
                  <BsThreeDots
                    color='lightgrey'
                    style={{ justifySelf: 'center', margin: 10 }}
                  />
                }
              </>
            }
          </div>
        </div>
      ))}
      <hr/>
    </div>
  )
};

export default GroupEndUsers;