import React, { useState, useEffect } from 'react';
import apiKeyClient from '../apiKeyClient';
import { useLocation } from "react-router-dom";
import { useMutation } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import { ImSpinner2 } from 'react-icons/im';
import { MUTATION_verifyEndUserEmailConfirm } from '../api/mutations';
import validator from 'validator';
// import { onError } from '../libs/errorLib';

function VerifyEndUserEmail() {
  const location = useLocation();
  const endUserToken = new URLSearchParams(location.search).get('token');
  const [isLoading, setIsLoading] = useState(true);
  const [verifyEndUserEmailConfirm, { data }] = useMutation(MUTATION_verifyEndUserEmailConfirm, {
    client: apiKeyClient
  })
  // const [data, setData] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(null);

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);
      if (!data) {
        await verifyEndUserEmailConfirm({
          variables: {
            endUserToken
          }
        })
      }
      const emailVerified = data && data.verifyEndUserEmailConfirm;
      console.log(emailVerified);
      if (emailVerified && validator.isEmail(emailVerified)) {
        setIsEmailVerified(true);
      }
      setIsLoading(false);
    };
    onLoad();
  },[verifyEndUserEmailConfirm, endUserToken, data]);

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
  console.log('isEmailVerified', isEmailVerified);
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
      {isEmailVerified &&
        <Card
          border='success'
        >
          <Card.Header>Confirmation success!</Card.Header>
          <Card.Body>
            <Card.Title>Email is verified</Card.Title>
            <Card.Text>
              Thank You! Now you can receive next actions daily on your email.
            </Card.Text>
          </Card.Body>
        </Card>
      }
      {(!isEmailVerified && !isLoading) &&
        <Card
          border='warning'
        >
          <Card.Header>Confirmation failed!</Card.Header>
          <Card.Body>
            <Card.Title>Email is not verified</Card.Title>
            <Card.Text>
              Contact your manager to send you new confirmation link.
            </Card.Text>
          </Card.Body>
        </Card>
      }
    </>
  )
}

export default VerifyEndUserEmail;