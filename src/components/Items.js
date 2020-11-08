import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useAppContext } from "../libs/contextLib";
import { useQuery } from '@apollo/client'
import { QUERY_listItems } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./Items.css";
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';
import enGb from 'date-fns/locale/en-GB';
import { onError } from "../libs/errorLib";
registerLocale('en-gb', enGb);

export default function Items() {
  const history = useHistory();
  // const [items, setItems] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isSearching, setIsSearching] = useState(false);
  const [modelNumber, setModelNumber] = useState('LG 34BN770-B');
  const [serialNumber, setSerialNumber] = useState('');
  const [dateWarrantyBegins, setDateWarrantyBegins] = useState('');
  const [dateWarrantyExpires, setDateWarrantyExpires] = useState('');
  const { loading, error, data } = useQuery(QUERY_listItems);
  
  // function loadItems() {
  //   return API.get('items', '/items');
  // }
  useEffect(() => {
    async function onLoad() {
      // console.log(isAuthenticated)
      if (!isAuthenticated) {
        return null;
      }
      // try {
      //   const items = await loadItems();
      //   setItems(items);
      // } catch (error) {
      //   onError(error);
      // }
      // setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  if (error) {
    console.log(error);
  }

  if (isAuthenticated && loading && !error) {
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

  const items = data && data.listItems;
  // console.log(data);
  function renderItemsList(items) {
    return items.map((item) =>
      (
        <tr
          key={item.id}
        >
          <td>
            {item.modelNumber}
          </td>
          <td>
            <Link
              to={`/items/${item.id}`}
            >
              {item.serialNumber}
            </Link>
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
      )
    );
  };
  function renderLander() {
    return(
      <div className="lander">
        <h1>{'Hardware management service'}</h1>
        <p>{'Keep your hardware up to date'}</p>
      </div>
    );
  };
  function renderItems() {
    return(
      <div
        className='Items'
      >
        <Table
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            <col span='1' style={{ width: 25+'%' }}/>
            <col span='1' style={{ width: 30+'%' }}/>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 20+'%' }}/>
            <col span='1' style={{ width: 5+'%' }}/>
          </colgroup>
          <thead>
            <tr>
              <th>
                {'Model'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    placeholder='Model Number'
                    value={modelNumber}
                    onChange={(event) => setModelNumber(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Serial Nr'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    placeholder='Serial Number'
                    value={serialNumber}
                    onChange={(event) => setSerialNumber(event.target.value)}
                  />
                }
              </th>
              <th>
                {'Warranty begins'}
                {isSearching &&
                  <Form.Control as={DatePicker}
                    className='SearchInput date-picker'
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
                  {!isSearching &&
                    <ImSearch
                      onClick={() => setIsSearching(!isSearching)}
                    />
                  }
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
      </div>
    )
  };
  return (
    <div
      className='Items'
    >
      {isAuthenticated ?
        <div>
          <Button
            className='AddItemButton'
            variant='outline-primary'
            title='Add Item'
            onClick={() => history.push('/items/new')}
          >
            Add Item
          </Button>
          {renderItems()}
        </div> :
        renderLander()
      }
    </div>
  );
};