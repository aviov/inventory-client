import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useAuthContext } from "../libs/contextLib";
import { useLazyQuery } from '@apollo/client'
import { QUERY_listProjects } from '../api/queries'
import { ImSpinner2 } from 'react-icons/im';
// import { ImSearch } from 'react-icons/im';
import { ImCancelCircle } from 'react-icons/im';
import "./Projects.css";
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';
import enGb from 'date-fns/locale/en-GB';
import { onError } from "../libs/errorLib";
import { getSortedByDateCreatedAt } from "../libs/fnsLib";
registerLocale('en-gb', enGb);

export default function Projects() {
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isSearching, setIsSearching] = useState(false);
  // const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  // const [inventoryNumber, setInventoryNumber] = useState('');
  // const [endUserName, setEndUserName] = useState('');
  // const [locationName, setLocationName] = useState('');
  // const [actionIsVisibleLatestDateCreatedAt, setActionIsVisibleLatestDateCreatedAt] = useState('');
  // const [actionIsVisibleNextDateCreatedAt, setActionIsVisibleNextDateCreatedAt] = useState('');
  // const [dateWarrantyBegins, setDateWarrantyBegins] = useState('');
  const [dateEstimEnd, setDateWarrantyExpires] = useState('');
  const [listProjects, { loading, data }] = useLazyQuery(QUERY_listProjects);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      try {
        listProjects();
        setProjects(data ? data.listProjects : []);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  },[isAuthenticated, listProjects, data]);

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
  
  function renderProjectsList(projects=[]) {
    return getSortedByDateCreatedAt(projects).map((project) => {
      return(
        <tr
          className='ListProject'
          key={project.id}
          onClick={() => history.push(`/projects/${project.id}`)}
        >
          {/* <td>
            {project.projectType ? project.projectType.name : ''}
          </td> */}
          {/* <td>
            {project.modelNumber}
          </td> */}
          <td>
            {project.serialNumber}
          </td>
          {/* <td>
            {project.inventoryNumber}
          </td> */}
          {/* <td>
            {project.endUser && project.endUser.name}
          </td>
          <td>
            {project.location && project.location.name}
          </td> */}
          {/* <td>
            {new Date(project.dateWarrantyBegins).toLocaleDateString('RU-ru')}
          </td> */}
          <td>
            {new Date(project.dateEstimEnd).toLocaleDateString('RU-ru')}
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
  function renderProjects() {
    return(
      <div
        className='Projects List'
      >
        <Table
          striped
          style={{ width: 100+'%' }}
          responsive
        >
          <colgroup>
            {/* <col span='1' style={{ width: 10+'%' }}/> */}
            {/* <col span='1' style={{ width: 15+'%' }}/> */}
            <col span='1' style={{ width: 20+'%' }}/>
            {/* <col span='1' style={{ width: 20+'%' }}/> */}
            {/* <col span='1' style={{ width: 10+'%' }}/> */}
            {/* <col span='1' style={{ width: 10+'%' }}/> */}
            {/* <col span='1' style={{ width: 10+'%' }}/> */}
            <col span='1' style={{ width: 10+'%' }}/>
            <col span='1' style={{ width: 5+'%' }}/>
          </colgroup>
          <thead>
            <tr>
              {/* <th>
                {'Type'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                  />
                }
              </th> */}
              {/* <th>
                {'Model'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={modelNumber}
                    onChange={(event) => setModelNumber(event.target.value)}
                  />
                }
              </th> */}
              <th>
                {'Nr'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={serialNumber}
                    onChange={(event) => setSerialNumber(event.target.value)}
                  />
                }
              </th>
              {/* <th>
                {'Inventory nr'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={inventoryNumber}
                    onChange={(event) => setInventoryNumber(event.target.value)}
                  />
                }
              </th> */}
              {/* <th>
                {'Person'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={endUserName}
                    onChange={(event) => setEndUserName(event.target.value)}
                  />
                }
              </th> */}
              {/* <th>
                {'Location'}
                {isSearching &&
                  <Form.Control
                    className='SearchInput'
                    type='text'
                    value={locationName}
                    onChange={(event) => setLocationName(event.target.value)}
                  />
                }
              </th> */}
              {/* <th>
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
              </th> */}
              <th>
                {'End date'}
                {isSearching &&
                  <Form.Control as={DatePicker}
                    className='SearchInput date-picker'
                    popperPlacement='top-end'
                    dateFormat='dd.MM.yyyy'
                    locale='en-gb'
                    selected={dateEstimEnd}
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
              renderProjectsList(projects)
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
      className='Projects'
    >
      {isAuthenticated ?
        <div>
          {//!loading &&
            <Button
              disabled={loading}
              className='AddProjectButton'
              size='sm'
              variant='outline-primary'
              title='Add Project'
              onClick={() => history.push('/projects/new')}
            >
              Add Project
            </Button>
          }
          {renderProjects()}
        </div> :
        renderLander()
      }
    </div>
  );
};