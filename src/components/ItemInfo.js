import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_getItemById, QUERY_listItems } from '../api/queries';
import LoadingButton from './LoadingButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ImagePreview from './ImagePreview';
import { ImSpinner2 } from 'react-icons/im';
import { FcApproval } from 'react-icons/fc';
import { MdError } from 'react-icons/md';
import './ItemInfo.css'
import { s3Delete } from '../libs/awsLib';
import { MUTATION_deleteItem } from "../api/mutations";

function ItemInfo() {
  const { id } = useParams();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const { loading, data } = useQuery(QUERY_getItemById, {
    variables: { itemId: id }
  });
  const [deleteItem] = useMutation(MUTATION_deleteItem, {
    refetchQueries: [{ query: QUERY_listItems }]
  });

  async function handleDelete(item) {
    const confirmed = window.confirm(`Do you want to delete item ${item.modelNumber}, SN: ${item.serialNumber}?`);
    if (confirmed) {
      setIsDeleting(true);
      if (item.attachments) {
        await s3Delete(JSON.parse(item.attachments));
      }
      await deleteItem({ variables: { itemId: id } });
      history.push('/items');
    } else {
      return null;
    }
  };

  if (loading) {
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
  const item = data.getItemById;

  // function formatFilename(str) {
  //   return str.replace(/^\w+-/, '');
  // };
  // console.log(data);
  const dateWarrantyBeginsFormatted = new Date(item.dateWarrantyBegins).toLocaleDateString('de-DE')
  const dateWarrantyExpiresFormatted = item.dateWarrantyExpires !== '' ? new Date(item.dateWarrantyExpires).toLocaleDateString('de-DE') : 'Lifetime'
  const isWarrantyValid = item.dateWarrantyExpires ? new Date().valueOf() <= new Date(item.dateWarrantyExpires).valueOf() : true;
  return(
    data && !loading &&
    <div
      className='ItemInfo'
    >
      <Container
        // fluid
      >
        <Row>
          <Col>
            <div
              className='justify-content-md-center SerialInfo'
            >
              {`SN ${item.serialNumber}`}
            </div>
            <hr/>
            <div
              className='justify-content-md-center WarrantyInfo'
            >
              {isWarrantyValid ?
                `Warranty: ${dateWarrantyBeginsFormatted} - ${dateWarrantyExpiresFormatted}`
                :
                `Warranty expired ${dateWarrantyExpiresFormatted}`
              }
              {isWarrantyValid &&
                <FcApproval />
              }
              {!isWarrantyValid &&
                <MdError
                  color={'red'}
                />
              }
            </div>
            <hr/>
            <div
              className='justify-content-md-center ModelInfo'
            >
              {item.modelNumber}
            </div>
            {/* {item.attachments && JSON.parse(item.attachments).map((attachment) => (
              <a
                key={attachment}
                target="_blank"
                rel="noopener noreferrer"
                href={attachment} //attachemntURL
              >
                {attachment}
              </a>
            ))} */}
          </Col>
          <Col lg='7'>
            {item && item.attachments && JSON.parse(item.attachments).map((attachment) => (
              <ImagePreview
                key={attachment}
                filename={attachment}
              />
            ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <LoadingButton
              size='sm'
              color='red'
              variant='outline-danger'
              disabled={isDeleting}
              type='submit'
              isLoading={isDeleting}
              onClick={() => handleDelete(item)}
            >
              Delete Item
            </LoadingButton>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ItemInfo