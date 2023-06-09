import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listGroups } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./Groups.css";
import { onError } from "../libs/errorLib";

export default function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');
  const [regNr, setRegNr] = useState('');
  const [email, setEmail] = useState('');
  const [webPage, setWebPage] = useState('');
  const [phone, setPhone] = useState('');
  const [listGroups, { loading, data }] = useLazyQuery(QUERY_listGroups);

  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      try {
        listGroups();
        setGroups(data ? data.listGroups : []);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  },[isAuthenticated, listGroups, data]);

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
  
  function renderGroupsList(groups=[]) {
    return groups.map((group) =>
      (
        <tr
          className='ListGroups'
          key={group.id}
          onClick={() => navigate(`/groups/${group.id}`)}
        >
          <td>
            {group.name}
          </td>
          <td>
            {group.email}
          </td>
          <td>
            {group.regNr}
          </td>
          <td>
            {group.phone}
          </td>
          <td>
            {group.webPage}
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
      </div>
    );
  };
  function renderGroups() {
    return(
      <div
        className='Groups List'
      >
        <Table
          striped
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 15+'%' }}/>
            <col span='1' style={{ width: 5+'%' }}/>
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
                {'Reg nr'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={regNr}
                    onChange={(event) => setRegNr(event.target.value)}
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
                {'Web page'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={webPage}
                    onChange={(event) => setWebPage(event.target.value)}
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
              renderGroupsList(groups)
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
      className='Groups'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddGroupButton'
              size='sm'
              variant='outline-primary'
              title='Add Group'
              onClick={() => navigate('/groups/new')}
            >
              Add group
            </Button>
          }
          {renderGroups()}
        </div> :
        renderLander()
      }
    </div>
  );
};