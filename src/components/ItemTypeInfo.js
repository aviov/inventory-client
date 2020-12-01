import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLazyQuery, useMutation } from '@apollo/client';
import { QUERY_getItemTypeById, QUERY_listItemTypes } from '../api/queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ImSpinner2 } from 'react-icons/im';
import { useAuthContext } from "../libs/contextLib";
import LoadingButton from './LoadingButton';
import './ItemTypeInfo.css'
import { MUTATION_deleteItemType, MUTATION_updateItemType } from "../api/mutations";
import { onError } from "../libs/errorLib";

function ItemTypeInfo() {
  const { isAuthenticated } = useAuthContext();
  const { id } = useParams();
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [itemType, setItemType] = useState({
    id,
    name: ''
  });
  const [itemTypeUpdate, setItemTypeUpdate] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [getItemTypeById, { data, loading }] = useLazyQuery(QUERY_getItemTypeById);
  const [updateItemType] = useMutation(MUTATION_updateItemType);
  const [deleteItemType] = useMutation(MUTATION_deleteItemType, {
    refetchQueries: [{ query: QUERY_listItemTypes }]
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
    function onLoad() {
      setIsLoading(true);
      try {
        getItemTypeById({
          variables: { itemTypeId: id }
        });
        const itemTypeById = data && data.getItemTypeById;
        // console.log(data);
        if (itemTypeById) {
          const {
            id,
            name
          } = itemTypeById;
          setItemType(itemTypeById);
          setItemTypeUpdate({
            id,
            name
          });
        }
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    }
    onLoad();
  },[isAuthenticated, getItemTypeById, id, data]);

  async function handleSubmit({
    id,
    name
  }) {
    setIsUpdating(true);
    try {
      const data = await updateItemType({
        variables: {
          itemType: {
            id,
            name
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

  // console.log(typeof itemType.dateWarrantyBegins);
  // console.log(itemType.dateWarrantyBegins)
  // console.log(itemType.dateWarrantyExpires)


  async function handleDelete(itemType) {
    const confirmed = window.confirm(`Do you want to delete itemType ${itemType.modelNumber}, SN: ${itemType.serialNumber}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteItemType({ variables: { itemTypeId: id } });
        history.push('/itemTypes');
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
  // const itemType = data.getItemTypeById;
  // console.log(data);
  return(
    <div
      className='ItemTypeInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <Row className='justify-content-end'>
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
                    Edit
                  </LoadingButton>
                ) : (
                  <>
                    <LoadingButton
                      className='LoadingButton'
                      size='sm'
                      color='red'
                      variant='outline-danger'
                      disabled={isDeleting}
                      type='submit'
                      isLoading={isDeleting}
                      onClick={() => handleDelete(itemType)}
                    >
                      Delete
                    </LoadingButton>
                    <LoadingButton
                      className='LoadingButton'
                      size='sm'
                      variant='outline-primary'
                      disabled={isUpdating}
                      type='submit'
                      isLoading={isUpdating}
                      onClick={() => handleSubmit(itemTypeUpdate)}
                    >
                      Save
                    </LoadingButton>
                    <LoadingButton
                      className='LoadingButton'
                      size='sm'
                      variant='outline-secondary'
                      disabled={false}
                      type='submit'
                      isLoading={false}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </LoadingButton>
                  </>
                )
              }
            </Row>
            <hr/>
            <Form.Group as={Row}>
              <Form.Label column='sm=4'>
                Name
              </Form.Label>
              <Col sm='8'>
                {!isEditing ? (
                  <Form.Control
                    plaintext
                    readOnly
                    value={itemType.name}
                  />
                ) : (
                  <Form.Control
                    type='text'
                    placeholder='Name'
                    value={itemTypeUpdate.name}
                    onChange={(event) => setItemTypeUpdate({ ...itemTypeUpdate, name: event.target.value })}
                  />
                )}
              </Col>
            </Form.Group>
            <hr style={{ marginBottom: 30 }}/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ItemTypeInfo