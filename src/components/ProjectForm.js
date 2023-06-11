import React, {
  // useEffect,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom';
// import { ImSpinner2 } from 'react-icons/im';
import Form from 'react-bootstrap/Form';
// import Select from 'react-select';
import DatePicker, { registerLocale } from "react-datepicker";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
import { v1 as uuidv1 } from 'uuid';
import { s3Upload } from '../libs/awsLib';
import {
  // useLazyQuery,
  useMutation
} from '@apollo/client'
import { MUTATION_createProject } from '../api/mutations'
import {
  // QUERY_listProjectTypes,
  QUERY_listProjects
} from '../api/queries';
import LoadingButton from './LoadingButton';
import { onError } from '../libs/errorLib';
import { isImage, getImageSize } from '../libs/imageLib';
import './ProjectForm.css';
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';
import enGb from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGb);
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginMediaPreview
);

function ProjectForm() {
  const navigate = useNavigate();
  // const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  // const [inventoryNumber, setInventoryNumber] = useState('');
  const [dateEstimStart, setDateEstimStart] = useState('');
  const [dateEstimEnd, setDateEstimEnd] = useState('');
  // const [projectTypeId, setProjectTypeId] = useState('');
  // const [projectTypeOption, setProjectTypeOption] = useState(null);
  // const [projectTypeOptions, setProjectTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesResized, setFilesResized] = useState([]);
  // const [listProjectTypes, {
  //   data: dataProjectTypeOptions,
  // }] = useLazyQuery(QUERY_listProjectTypes, {
  //   fetchPolicy: 'cache-first'
  // });
  const [createProject] = useMutation(MUTATION_createProject, {
    refetchQueries: [{ query: QUERY_listProjects }]
  });

  // useEffect(() => {
  //   function onload() {
  //     setIsLoading(true);
  //     try {
  //       listProjectTypes();
  //       const data = dataProjectTypeOptions && dataProjectTypeOptions.listProjectTypes;
  //       if (data) {
  //         const options = data.map(({ id, name }) => ({ value: id, label: name }));
  //         setProjectTypeOptions(options);
  //       }
  //     } catch (error) {
  //       onError(error);
  //     }
  //     setIsLoading(false);
  //   };
  //   onload()
  // },[listProjectTypes, dataProjectTypeOptions])

  // function datePlusNYears({ date, nYears }) {
  //   if (date) {
  //     return new Date(date.valueOf() + (nYears * 365 * 24 * 60 * 60 * 1000));
  //   }
  //   return date
  // };

  function validateForm(fields={}) {
    if(Object.values(fields).includes('')) {
      return false
    } else {
      return true
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const id = 'project:' + uuidv1();
    const dateCreatedAt = new Date();
    setIsLoading(true);
    try {
      const filesResizedToUpload = files.map(({ file }) =>
        (filesResized.find(({ filename }) => (filename === file.name))));
      const attachments = (filesResizedToUpload && filesResizedToUpload.length > 0) ? 
      await Promise.all(filesResizedToUpload.map(async ({ file }) => {
        const key = await s3Upload(file);
        if (isImage(file)) {
          const { width, height } = await getImageSize(file);
          return { key, type: file.type, width, height };
        } else {
          return { key, type: file.type };
        }
      })) : []
      const projectCreated = await createProject({
        variables: {
          project: {
            id,
            // name,
            serialNumber,
            // description,
            dateCreatedAt,
            // valueUnitsA,
            // valueEstimA,
            // valueUnitsB,
            // valueEstimB,
            dateEstimStart,
            dateEstimEnd,
            // dateActionStart,
            // dateActionEnd,
            // index,
            attachments: JSON.stringify(attachments),

            // modelNumber,
            // inventoryNumber,
            // projectTypeId: 'project:' + projectTypeId
          }
        }
      })
      if (projectCreated) {
        setIsLoading(false);
        setSerialNumber('');
        // setDateEstimStart('');
        // setDateEstimEnd('');
        navigate('/projects');
      }
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  // if (!dataProjectTypeOptions) {
  //   return(
  //     <div
  //       className='Loading'
  //     >
  //       <ImSpinner2
  //         className='spinning'
  //       />
  //     </div>
  //   )
  // }

  return(
    <div
      className='ProjectForm'
    >
      <Form>
        {/* <Form.Group className='mb-3'>
          <Form.Label>
            Project type
          </Form.Label>
          <Select
            isClearable={true}
            value={projectTypeOption}
            options={projectTypeOptions}onChange={(option) => {
              setProjectTypeOption(option);
              setProjectTypeId(option ? option.value : '');
            }}
          />
        </Form.Group> */}
        {/* <Form.Group className='mb-3'>
          <Form.Label>
            Model nr
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Model'
            value={modelNumber}
            onChange={(event) => setModelNumber(event.target.value)}
          />
        </Form.Group> */}
        <Form.Group className='mb-3'>
          <Form.Label>
            Project nr
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Project nr'
            id={'serialNumber'}
            value={serialNumber}
            onChange={(event) => setSerialNumber(event.target.value)}
          />
        </Form.Group>
        {/* <Form.Group className='mb-3'>
          <Form.Label>
            Inventory number
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Serial number'
            id={'inventoryNumber'}
            value={inventoryNumber}
            onChange={(event) => setInventoryNumber(event.target.value)}
          />
        </Form.Group> */}
        <Form.Group className='mb-3'>
          <Form.Label>
            Start
          </Form.Label>
          <Form.Control as={DatePicker}
            className="date-picker"
            withPortal={true}
            dateFormat='dd.MM.yyyy'
            placeholderText='Select date'
            locale='en-gb'
            // todayButton='Today'
            selected={dateEstimStart}
            onSelect={(date) => {
              if (!date) {
                setDateEstimStart('');
                return null;
              } else {
                setDateEstimStart(date);
                // setDateEstimEnd(datePlusNYears({ date, nYears: 1 }));
              }
            }}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>
            End
          </Form.Label>
          <Form.Control as={DatePicker}
            className='date-picker'
            withPortal={true}
            dateFormat='dd.MM.yyyy'
            placeholderText='Select date'
            locale='en-gb'
            // todayButton='Today'
            selected={dateEstimEnd}
            onSelect={(date) => {
              if (!date) {
                setDateEstimEnd('');
                return null;
              } else {
                setDateEstimEnd(date);
              }
            }}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Images</Form.Label>
          <FilePond
            files={files}
            allowFileTypeValidation={true}
            acceptedFileTypes={['image/*', 'application/pdf']}
            labelFileTypeNotAllowed={'Only image or pdf can be uploaded'}
            allowFileSizeValidation={true}
            maxFileSize={'3MB'}
            allowImageResize={true}
            imageResizeTargetWidth={'500'}
            imageResizeMode={'contain'}
            imageResizeUpscale={false}
            onpreparefile={(fileItem, output) => {
              const filename = fileItem.filename;
              const type = fileItem.fileType;
              const transformedFile = new File([output], filename, { type });
              setFilesResized([ ...filesResized, { file: transformedFile, filename, fileType: type } ]);
            }}
            allowReorder={false}
            allowMultiple={true}
            maxFiles={3}
            onupdatefiles={setFiles}
            labelIdle='Drop files or <span class="filepond--label-action">Browse</span>'
            credits={false}
          />
        </Form.Group>
        <LoadingButton
          // block
          disabled={!validateForm({
            // modelNumber,
            serialNumber,
            dateEstimStart,
            dateEstimEnd
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

export default ProjectForm