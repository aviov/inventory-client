import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listOrgs } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./Orgs.css";
import { onError } from "../libs/errorLib";

export default function Orgs({ prefix, prefixType }) {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [listOrgs, { loading, data }] = useLazyQuery(QUERY_listOrgs, {
    variables: { prefix }
  });

  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      try {
        listOrgs();
        setOrgs(data ? data.listOrgs : []);
      } catch (error) {
        onError(error);
      }
    }
    onLoad();
  },[isAuthenticated, listOrgs, data]);

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
  
  function renderOrgsList(orgs=[]) {
    return orgs.map((org) =>
      (
        <tr
          className='ListOrg'
          key={org.id}
          onClick={() => navigate(`/${prefixType}/${org.id}`)}
        >
          <td>
            {org.name}
          </td>
          <td>
            {org.email}
          </td>
          <td>
            {org.phone}
          </td>
          <td>
            {org.city}
          </td>
          <td>
            {org.country}
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
  function renderOrgs() {
    return(
      <div
        className='Orgs List'
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
                {'City'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Country'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
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
              renderOrgsList(orgs)
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
      className='Orgs'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddOrgButton'
              size='sm'
              variant='outline-primary'
              title='Add Organization'
              onClick={() => navigate(`/${prefixType}/new`)}
            >
              Add Organization
            </Button>
          }
          {renderOrgs()}
        </div> :
        renderLander()
      }
    </div>
  );
};