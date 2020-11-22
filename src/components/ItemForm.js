import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker, { registerLocale } from "react-datepicker";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { v1 as uuidv1 } from 'uuid';
import { s3Upload } from '../libs/awsLib';
import { useMutation } from '@apollo/client'
import { MUTATION_createItem } from '../api/mutations'
import { QUERY_listItems } from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import { isImage, getImageSize } from '../libs/imageLib';
import './ItemForm.css';
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';
import enGb from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGb);
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImageResize, FilePondPluginImagePreview, FilePondPluginFileValidateType);

function ItemForm() {
  const history = useHistory();
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [dateWarrantyBegins, setDateWarrantyBegins] = useState('');
  const [dateWarrantyExpires, setDateWarrantyExpires] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [createItem] = useMutation(MUTATION_createItem, {
    refetchQueries: [{ query: QUERY_listItems }]
  });


  function datePlusNYears({ date, nYears }) {
    if (date) {
      return new Date(date.valueOf() + (nYears * 365 * 24 * 60 * 60 * 1000));
    }
    return date
  };

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const id = uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    // console.log(
    //   'id', id,
    //   'dateCreatedAt', dateCreatedAt,
    //   'modelNumber', modelNumber,
    //   'serialNumber', serialNumber,
    //   'dateWarrantyBegins', dateWarrantyBegins,
    //   'dateWarrantyExpires', dateWarrantyExpires
    // )
    try {
      const attachments = (files && files.length > 0) ? 
      await Promise.all(files.map(async ({ file }) => {
        const key = await s3Upload(file);
        if (isImage(file)) {
          const { width, height } = await getImageSize(file);
          return { key, type: file.type, width, height };
        } else {
          return { key, type: file.type };
        }
      })) : []
      // console.log(attachments);
      const itemCreated = await createItem({
        variables: {
          item: {
            id,
            dateCreatedAt,
            modelNumber,
            serialNumber,
            dateWarrantyBegins,
            dateWarrantyExpires,
            attachments: JSON.stringify(attachments)
          }
        }
      })
      if (itemCreated) {
        setIsLoading(false);
        setSerialNumber('');
        setDateWarrantyBegins('');
        setDateWarrantyExpires('');
        history.push('/items');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  // console.log(files);
  return(
    <div
      className='ItemForm'
    >
      <Form>
        <Form.Group>
          <Form.Label>
            Model Number
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Model Number'
            value={modelNumber}
            onChange={(event) => setModelNumber(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Serial Number
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Serial Number'
            id={'serialNumber'}
            value={serialNumber}
            onChange={(event) => setSerialNumber(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Warranty starts
          </Form.Label>
          <Form.Control as={DatePicker}
            className="date-picker"
            withPortal={true}
            dateFormat='dd.MM.yyyy'
            placeholderText='Select date'
            locale='en-gb'
            // todayButton='Today'
            selected={dateWarrantyBegins}
            onSelect={(date) => {
              if (!date) {
                setDateWarrantyBegins('');
                return null;
              } else {
                setDateWarrantyBegins(date);
                setDateWarrantyExpires(datePlusNYears({ date, nYears: 1 }));
              }
            }}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Warranty expires
          </Form.Label>
          <Form.Control as={DatePicker}
            className='date-picker'
            withPortal={true}
            dateFormat='dd.MM.yyyy'
            placeholderText='Select date'
            locale='en-gb'
            // todayButton='Today'
            selected={dateWarrantyExpires}
            onSelect={(date) => {
              if (!date) {
                setDateWarrantyExpires('');
                return null;
              } else {
                setDateWarrantyExpires(date);
              }
            }}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Images</Form.Label>
          <FilePond
            files={files}
            allowFileTypeValidation={true}
            acceptedFileTypes={['image/*']}
            labelFileTypeNotAllowed={'Only images can be uploaded'}
            // allowImageResize={true}
            // imageResizeTargetWidth={'1000'}
            // imageResizeTargetHeight={'1000'}
            // imageResizeMode={'force'}
            // imageResizeUpscale={false}
            allowReorder={false}
            allowMultiple={true}
            maxFiles={3}
            onupdatefiles={setFiles}
            labelIdle='Drop images or <span class="filepond--label-action">Browse</span>'
            credits={false}
          />
        </Form.Group>
        <LoadingButton
          block
          disabled={!validateForm({
            modelNumber,
            serialNumber,
            dateWarrantyBegins,
            dateWarrantyExpires
          })}
          type='submit'
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Form>
    </div>
  )
}

export default ItemForm