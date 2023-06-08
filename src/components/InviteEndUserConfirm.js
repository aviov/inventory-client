import React, { useState, useEffect } from 'react';
import apiKeyClient from '../apiKeyClient';
import { useLocation } from "react-router-dom";
import { useMutation } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import { ImSpinner2 } from 'react-icons/im';
import { MUTATION_inviteEndUserConfirm } from '../api/mutations';
// import validator from 'validator';
// import { onError } from '../libs/errorLib';

function InviteEndUserConfirm() {
  const location = useLocation();
  const endUserInfoToken = new URLSearchParams(location.search).get('token');
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEndUserConfirm, { data }] = useMutation(MUTATION_inviteEndUserConfirm, {
    client: apiKeyClient
  })
  // const [data, setData] = useState(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(null);

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);
      if (!data) {
        await inviteEndUserConfirm({
          variables: {
            endUserInfoToken
          }
        })
      }
      const confirmedBy = data && data.inviteEndUserConfirm;
      if (confirmedBy) {
        setIsEmailConfirmed(true);
      }
      setIsLoading(false);
    };
    onLoad();
  },[inviteEndUserConfirm, endUserInfoToken, data]);

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
  return (
    <>
      {/* {error &&
        <Card
          border='warning'
        >
          <Card.Header>Confirmation failed!</Card.Header>
          <Card.Body>
            <Card.Title>{'Email is not verified.' + ' ' + error.message}</Card.Title>
            <Card.Text>
              Contact your manager to send you new confirmation link.
            </Card.Text>
          </Card.Body>
        </Card>
      } */}
      {isEmailConfirmed &&
        <Card
          border='success'
        >
          <Card.Header>Confirmation success!</Card.Header>
          <Card.Body>
            <Card.Title>Welcome to keepserv group</Card.Title>
            <Card.Text>
              Thank You! Now you are in the group at keepserv.
            </Card.Text>
          </Card.Body>
        </Card>
      }
      {(!isEmailConfirmed && !isLoading) &&
        <Card
          border='warning'
        >
          <Card.Header>Confirmation failed!</Card.Header>
          <Card.Body>
            <Card.Title>Joining the group is not confirmed</Card.Title>
            <Card.Text>
              Contact your manager to send you new invitation link.
            </Card.Text>
          </Card.Body>
        </Card>
      }
    </>
  )
}

export default InviteEndUserConfirm;