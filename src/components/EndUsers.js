import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listEndUsers } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./EndUsers.css";
import { onError } from "../libs/errorLib";

export default function EndUsers() {
  const history = useHistory();
  const [endUsers, setEndUsers] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [listEndUsers, { loading, data }] = useLazyQuery(QUERY_listEndUsers);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    try {
      listEndUsers();
      setEndUsers(data ? data.listEndUsers : []);
    } catch (error) {
      onError(error);
    }
  },[isAuthenticated, loading, listEndUsers, data]);

  function renderLoading() {
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
  
  function renderEndUsersList(endUsers=[]) {
    return endUsers.map((endUser) =>
      (
        <tr
          className='ListEndUsers'
          key={endUser.id}
          onClick={() => history.push(`/endUsers/${endUser.id}`)}
        >
          <td>
            {endUser.name}
          </td>
          <td>
            {endUser.email}
          </td>
          <td>
            {endUser.phone}
          </td>
          <td>
          </td>
        </tr>
      )
    );
  };
  function renderLander() {
    return(
      <div className="lander">
        <h1>{'Inventory management service'}</h1>
        <p>{'Keep your inventory up to date'}</p>
      </div>
    );
  };
  function renderEndUsers() {
    return(
      <div
        className='EndUsers List'
      >
        <Table
          striped
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            <col span='1' style={{ width: 40+'%' }}/>
            <col span='1' style={{ width: 30+'%' }}/>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 10+'%' }}/>
          </colgroup>
          <thead>
            <tr>
              <th>
                {'Name'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Email'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Phone'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                }
              </th>
              <th>
                <div>
                  {/* {!isSearching &&
                    <ImSearch
                      onClick={() => setIsSearching(!isSearching)}
                    />
                  } */}
                  {isSearching &&
                    <ImCancelCircle
                      className='CloseSearchIcon'
                      onClick={() => setIsSearching(!isSearching)}
                    />
                  }
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              renderEndUsersList(endUsers)
            }
          </tbody>
        </Table>
        {loading &&
          renderLoading()
        }
      </div>
    )
  };
  return (
    <div
      className='EndUsers'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddEndUserButton'
              size='sm'
              variant='outline-primary'
              title='Add EndUser'
              onClick={() => history.push('/endUsers/new')}
            >
              Add end user
            </Button>
          }
          {renderEndUsers()}
        </div> :
        renderLander()
      }
    </div>
  );
};