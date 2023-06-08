import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listItemTypes } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./ItemTypes.css";
import { onError } from "../libs/errorLib";

export default function ItemTypes() {
  const navigate = useNavigate();
  const [itemTypes, setItemTypes] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');
  const [listItemTypes, { loading, data }] = useLazyQuery(QUERY_listItemTypes);

  useEffect(() => {
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      try {
        listItemTypes();
        setItemTypes(data ? data.listItemTypes : []);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  },[isAuthenticated, listItemTypes, data]);

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
  
  function renderItemTypesList(itemTypes=[]) {
    return itemTypes.map((itemType) =>
      (
        <tr
          className='ListItemType'
          key={itemType.id}
          onClick={() => navigate(`/itemTypes/${itemType.id}`)}
        >
          <td>
            {itemType.name}
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
  function renderItemTypes() {
    return(
      <div
        className='ItemTypes List'
      >
        <Table
          striped
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            <col span='1' style={{ width: 90+'%' }}/>
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
              renderItemTypesList(itemTypes)
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
      className='ItemTypes'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddItemTypeButton'
              size='sm'
              variant='outline-primary'
              title='Add ItemType'
              onClick={() => navigate('/itemTypes/new')}
            >
              Add Machine type
              {/* Add Item type */}
            </Button>
          }
          {renderItemTypes()}
        </div> :
        renderLander()
      }
    </div>
  );
};