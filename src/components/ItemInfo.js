import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getItemById, QUERY_listItems } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import DatePicker, { registerLocale } from 'react-datepicker';
// import ImagePreview from './ImagePreview';
import ImageGrid from './ImageGrid';
import { ImSpinner2 } from 'react-icons/im';
import { FcApproval } from 'react-icons/fc';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import { MdError } from 'react-icons/md';
import './ItemInfo.css'
import { s3Delete } from '../libs/awsLib';
import { MUTATION_deleteItem, MUTATION_updateItem } from "../api/mutations";
import { onError } from "../libs/errorLib";
import enGb from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGb);

function ItemInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [item, setItem] = useState({
    id,
    modelNumber: '',
    serialNumber: '',
    dateWarrantyBegins: new Date(),
    dateWarrantyExpires: new Date(),
    attachments: '[]'
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getItemById, { data, loading }] = useLazyQuery(QUERY_getItemById);
  const [updateItem] = useMutation(MUTATION_updateItem);
  const [deleteItem] = useMutation(MUTATION_deleteItem, {
    refetchQueries: [{ query: QUERY_listItems }]
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      setIsLoading(true);
      try {
        getItemById({
          variables: { itemId: id }
        });
        data && data.getItemById && setItem(data.getItemById);
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getItemById, id, data]);

  async function handleSubmit({
    id,
    modelNumber,
    serialNumber,
    dateWarrantyBegins,
    dateWarrantyExpires
  }) {
    setIsUpdating(true);
    try {
      const data = updateItem({
        variables: {
          item: {
            id,
            modelNumber,
            serialNumber,
            dateWarrantyBegins,
            dateWarrantyExpires
          }
        }
      });
      // console.log('data', data);
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } catch (error) {
      onError(error);
    }
  }

  console.log(typeof item.dateWarrantyBegins);
  // console.log(item.dateWarrantyBegins)
  // console.log(item.dateWarrantyExpires)


  async function handleDelete(item) {
    const confirmed = window.confirm(`Do you want to delete item ${item.modelNumber}, SN: ${item.serialNumber}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        if (item.attachments) {
          const filenames = JSON.parse(item.attachments).map(({ key }) => key);
          await Promise.all(filenames.map(async (filename) => {
            await s3Delete(filename);
          }));
        }
        await deleteItem({ variables: { itemId: id } });
        history.push('/items');
      } catch (error) {
        onError(error);
      }
      setIsDeleting(false);
    } else {
      return null;
    }
  };

  if (loading || isLoading) {
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
  // const item = data.getItemById;

  // function formatFilename(str) {
  //   return str.replace(/^\w+-/, '');
  // };
  // console.log(data);
  const isWarrantyValid = item.dateWarrantyExpires ? new Date().valueOf() <= new Date(item.dateWarrantyExpires).valueOf() : true;
  return(
    <div
      className='ItemInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Serial Number
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={item.serialNumber}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Serial Number'
                    value={item.serialNumber}
                    onChange={(event) => setItem({ ...item, serialNumber: event.target.value})}
                  />
                )}
              </Col>
            </Form.Group>
            <hr/>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Warranty begins
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={new Date(item.dateWarrantyBegins).toLocaleDateString('de-DE')}
                  />
                ) : (
                  <Form.Control as={DatePicker}
                    className="date-picker"
                    withPortal={true}
                    dateFormat='dd.MM.yyyy'
                    placeholderText='Select date'
                    locale='en-gb'
                    // todayButton='Today'
                    selected={new Date(item.dateWarrantyBegins)}
                    onSelect={(date) => {
                      if (!date) {
                        setItem({ ...item, dateWarrantyBegins: ''});
                        return null;
                      } else {
                        setItem({ ...item, dateWarrantyBegins: date});
                      }
                    }}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                  />
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              {isWarrantyValid ? (
                <>
                  <Form.Label column='sm=1'>
                    <FcApproval />
                  </Form.Label>
                  <Form.Label column='sm=4'>
                    expires
                  </Form.Label>
                </>
              ) : (
                <>
                  <Form.Label column='sm=1'>
                    <MdError
                      color={'red'}
                    />
                  </Form.Label>
                  <Form.Label column='sm=4'>
                    expired
                  </Form.Label>
                </>
              )}
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={new Date(item.dateWarrantyExpires).toLocaleDateString('de-DE')}
                  />
                ) : (
                  <Form.Control as={DatePicker}
                    className='date-picker'
                    withPortal={true}
                    dateFormat='dd.MM.yyyy'
                    placeholderText='Select date'
                    locale='en-gb'
                    // todayButton='Today'
                    selected={new Date(item.dateWarrantyExpires)}
                    onSelect={(date) => {
                      if (!date) {
                        setItem({ ...item, dateWarrantyExpires: ''});
                        return null;
                      } else {
                        setItem({ ...item, dateWarrantyExpires: date});
                      }
                    }}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                  />
                )}
              </Col>
            </Form.Group>
            <hr/>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Model
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={item.modelNumber}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Model number'
                    value={item.modelNumber}
                    onChange={(event) => setItem({ ...item, modelNumber: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
          </Col>
          <Col lg='7'>
            {(item && item.attachments && !isDeleting) &&
              <ImageGrid
                attachments={item.attachments}
              />
            }
            {/* {item && item.attachments && JSON.parse(item.attachments).map((attachment) => (
              
              <ImagePreview
                key={attachment}
                filename={attachment}
              />
            ))} */}
          </Col>
        </Row>
        <Row>
          {!isEditing ?
            (
              <LoadingButton
                className='LoadingButton'
                size='sm'
                color='orange'
                variant='outline-warning'
                disabled={false}
                type='submit'
                isLoading={false}
                onClick={() => setIsEditing(true)}
              >
                Edit item
              </LoadingButton>
            ) : (
              <>
                <LoadingButton
                  className='LoadingButton'
                  size='sm'
                  variant='outline-secondary'
                  disabled={false}
                  type='submit'
                  isLoading={false}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel update
                </LoadingButton>
                <LoadingButton
                  className='LoadingButton'
                  size='sm'
                  variant='outline-primary'
                  disabled={isUpdating}
                  type='submit'
                  isLoading={isUpdating}
                  onClick={() => handleSubmit(item)}
                >
                  Submit update
                </LoadingButton>
                <LoadingButton
                  className='LoadingButton'
                  size='sm'
                  color='red'
                  variant='outline-danger'
                  disabled={isDeleting}
                  type='submit'
                  isLoading={isDeleting}
                  onClick={() => handleDelete(item)}
                >
                  Delete item
                </LoadingButton>
              </>
            )
          }
        </Row>
      </Container>
    </div>
  )
}

export default ItemInfo