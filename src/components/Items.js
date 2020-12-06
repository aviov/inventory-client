import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listItems } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./Items.css";
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';
import enGb from 'date-fns/locale/en-GB';
import { onError } from "../libs/errorLib";
import { getLatestByDateCreatedAt, getSortedByDateCreatedAt } from '../libs/fnsLib';
registerLocale('en-gb', enGb);

export default function Items() {
  const history = useHistory();
  const [items, setItems] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [inventoryNumber, setInventoryNumber] = useState('');
  const [endUserName, setEndUserName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [dateWarrantyBegins, setDateWarrantyBegins] = useState('');
  const [dateWarrantyExpires, setDateWarrantyExpires] = useState('');
  const [listItems, { loading, data }] = useLazyQuery(QUERY_listItems);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      try {
        listItems();
        setItems(data ? data.listItems : []);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  },[isAuthenticated, listItems, data]);

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
  
  function renderItemsList(items=[]) {
    return getSortedByDateCreatedAt(items).map((item) => {
      const actionLatest = (item.actions && item.actions.length > 0) && getLatestByDateCreatedAt(item.actions);
      return(
        <tr
          className='ListItem'
          key={item.id}
          onClick={() => history.push(`/items/${item.id}`)}
        >
          <td>
            {item.itemType ? item.itemType.name : ''}
          </td>
          <td>
            {item.modelNumber}
          </td>
          <td>
            {item.serialNumber}
          </td>
          <td>
            {item.inventoryNumber}
          </td>
          <td>
            {actionLatest && actionLatest.endUser && actionLatest.endUser.name}
          </td>
          <td>
            {actionLatest && actionLatest.location && actionLatest.location.name}
          </td>
          <td>
            {new Date(item.dateWarrantyBegins).toLocaleDateString('RU-ru')}
          </td>
          <td>
            {new Date(item.dateWarrantyExpires).toLocaleDateString('RU-ru')}
          </td>
          <td>

          </td>
        </tr>
      )}
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
  function renderItems() {
    return(
      <div
        className='Items List'
      >
        <Table
          striped
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            <col span='1' style={{ width: 10+'%' }}/>
            <col span='1' style={{ width: 10+'%' }}/>
            <col span='1' style={{ width: 15+'%' }}/>
            <col span='1' style={{ width: 15+'%' }}/>
            <col span='1' style={{ width: 15+'%' }}/>
            <col span='1' style={{ width: 10+'%' }}/>
            <col span='1' style={{ width: 10+'%' }}/>
            <col span='1' style={{ width: 10+'%' }}/>
            <col span='1' style={{ width: 5+'%' }}/>
          </colgroup>
          <thead>
            <tr>
              <th>
                {'Type'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                  />
                }
              </th>
              <th>
                {'Model'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={modelNumber}
                    onChange={(event) => setModelNumber(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Serial nr'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={serialNumber}
                    onChange={(event) => setSerialNumber(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Inventory nr'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={inventoryNumber}
                    onChange={(event) => setInventoryNumber(event.target.value)}
                  />
                }
              </th>
              <th>
                {'End user'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={endUserName}
                    onChange={(event) => setEndUserName(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Location'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={locationName}
                    onChange={(event) => setLocationName(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Warranty begins'}
                {isSearching &&
                  <Form.Control as={DatePicker}
                    className='SearchInput date-picker'
                    popperPlacement='top-end'
                    dateFormat='dd.MM.yyyy'
                    locale='en-gb'
                    selected={dateWarrantyBegins}
                    onSelect={(date) => {
                      if (!date) {
                        setDateWarrantyBegins('');
                        return null;
                      } else {
                        setDateWarrantyBegins(date);
                      }
                    }}
                  />
                }
              </th>
              <th>
                {'Warranty expires'}
                {isSearching &&
                  <Form.Control as={DatePicker}
                    className='SearchInput date-picker'
                    popperPlacement='top-end'
                    dateFormat='dd.MM.yyyy'
                    locale='en-gb'
                    selected={dateWarrantyExpires}
                    onSelect={(date) => {
                      if (!date) {
                        setDateWarrantyExpires('');
                        return null;
                      } else {
                        setDateWarrantyExpires(date);
                      }
                    }}
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
              renderItemsList(items)
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
      className='Items'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddItemButton'
              size='sm'
              variant='outline-primary'
              title='Add Item'
              onClick={() => history.push('/items/new')}
            >
              Add Item
            </Button>
          }
          {renderItems()}
        </div> :
        renderLander()
      }
    </div>
  );
};