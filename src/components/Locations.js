import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listLocations } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./Locations.css";
import { onError } from "../libs/errorLib";

export default function Locations() {
  const history = useHistory();
  const [locations, setLocations] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [listLocations, { loading, data }] = useLazyQuery(QUERY_listLocations);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onload() {
      try {
        listLocations();
        setLocations(data ? data.listLocations : []);
      } catch (error) {
        onError(error);
      }
    }
    onload();
  },[isAuthenticated, listLocations, data]);

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
  
  function renderLocationsList(locations=[]) {
    return locations.map((location) =>
      (
        <tr
          className='ListLocation'
          key={location.id}
          onClick={() => history.push(`/locations/${location.id}`)}
        >
          <td>
            {location.name}
          </td>
          <td>
            {location.email}
          </td>
          <td>
            {location.phone}
          </td>
          <td>
            {location.city}
          </td>
          <td>
            {location.country}
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
  function renderLocations() {
    return(
      <div
        className='Locations List'
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
              renderLocationsList(locations)
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
      className='Locations'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddLocationButton'
              size='sm'
              variant='outline-primary'
              title='Add Location'
              onClick={() => history.push('/locations/new')}
            >
              Add Location
            </Button>
          }
          {renderLocations()}
        </div> :
        renderLander()
      }
    </div>
  );
};