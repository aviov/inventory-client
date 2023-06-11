import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    function onLoad() {
      if (!isAuthenticated) {
        return null;
      }
      setIsLoading(true);
      try {
        getItemTypeById({
          variables: { itemTypeId: id }
        });
        const itemTypeById = data && data.getItemTypeById;
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
      if (data) {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } catch (error) {
      onError(error);
    }
  }

  async function handleDelete(itemType) {
    const confirmed = window.confirm(`Do you want to delete item type ${itemType.name}?`);
    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteItemType({ variables: { itemTypeId: id } });
        navigate('/itemTypes');
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
  
  return(
    <div
      className='ItemTypeInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <div className="d-flex justify-content-end">
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
            </div>
            <hr/>
            <Form.Group className='mb-3' as={Row}>
              <Form.Label column='sm=4' className='font-weight-bold'>
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