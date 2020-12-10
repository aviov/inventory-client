import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listActionTypes } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
import { ImCheckmark } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./ActionTypes.css";
import { onError } from "../libs/errorLib";

export default function ActionTypes() {
  const history = useHistory();
  const [actionTypes, setActionTypes] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');
  const [isVisibleLatest, setIsVisibleLatest] = useState(false);
  const [isVisibleNext, setIsVisibleNext] = useState(false);
  const [listActionTypes, { loading, data }] = useLazyQuery(QUERY_listActionTypes);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      try {
        listActionTypes();
        setActionTypes(data ? data.listActionTypes : []);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  },[isAuthenticated, listActionTypes, data]);

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
  
  function renderActionTypesList(actionTypes=[]) {
    return actionTypes.map((actionType) =>
      (
        <tr
          className='ListActionType'
          key={actionType.id}
          onClick={() => history.push(`/actionTypes/${actionType.id}`)}
        >
          <td>
            {actionType.name}
          </td>
          <td>
            {actionType.isVisibleLatest ? (<ImCheckmark/>) : ('')}
          </td>
          <td>
            {actionType.isVisibleNext ? (<ImCheckmark/>) : ('')}
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
  function renderActionTypes() {
    return(
      <div
        className='ActionTypes List'
      >
        <Table
          striped
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            <col span='1' style={{ width: 30+'%' }}/>
            <col span='1' style={{ width: 30+'%' }}/>
            <col span='1' style={{ width: 30+'%' }}/>
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
                {'Latest action is visible'}
                {isSearching &&
                  <Form.Check
                    type='switch'
                    id='isVisibleLatest'
                    // label='Visible latest'
                    value={isVisibleLatest}
                    onChange={() => setIsVisibleLatest(isVisibleLatest ? false : true)}
                  />
                }
              </th>
              <th>
                {'Next action is visible'}
                {isSearching &&
                  <Form.Check
                    type='switch'
                    id='isVisibleNext'
                    // label='Visible latest'
                    value={isVisibleNext}
                    onChange={() => setIsVisibleNext(isVisibleNext ? false : true)}
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
              renderActionTypesList(actionTypes)
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
      className='ActionTypes'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddActionTypeButton'
              size='sm'
              variant='outline-primary'
              title='Add ActionType'
              onClick={() => history.push('/actionTypes/new')}
            >
              Add action type
            </Button>
          }
          {renderActionTypes()}
        </div> :
        renderLander()
      }
    </div>
  );
};