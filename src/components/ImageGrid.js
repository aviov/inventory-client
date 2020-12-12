import React, { useEffect, useState } from 'react';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ImSpinner2 } from 'react-icons/im';
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginGetFile from 'filepond-plugin-get-file';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
import 'filepond-plugin-get-file/dist/filepond-plugin-get-file.min.css';
import './ImageGrid.css';
// import Gallery from 'react-photo-gallery';
import { s3FileURL } from '../libs/awsLib';
import { s3Upload, s3Delete } from '../libs/awsLib';
import { useMutation } from '@apollo/client'
import { MUTATION_updateItem } from '../api/mutations'
import { MUTATION_updateAction } from '../api/mutations';
import { isImage, getImageSize } from '../libs/imageLib';
import { onError } from '../libs/errorLib';
import LoadingButton from './LoadingButton';
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginMediaPreview,
  FilePondPluginGetFile
);

function ImageGrid({ attachments='[]', entityId, entityType }) {
  const [prevAttachments, setPrevAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingFiles, setIsEditingFiles] = useState(false);
  // const [isDeletingFiles, setIsDeletingFiles] = useState(false);
  const [isUpdatingFiles, setIsUpdatingFiles] = useState(false);
  const [updateItem] = useMutation(MUTATION_updateItem);
  const [updateAction] = useMutation(MUTATION_updateAction);
  const [urlsFromServer, setUrlsFromServer] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesResized, setFilesResized] = useState([]);

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);
      // console.log(attachments);
      try {
        const filepondData = await Promise.all(JSON.parse(attachments).map(async ({ key, type, width, height }) => {
          const source = await s3FileURL(key);
          if (isImage({ type })) {
            return {
              source,
              key,
              options: {
                type: 'local'
              }
            };
          } else {
            return {
              source, //: '/images/file-icon-420x420.png',
              key,
              options: {
                type: 'local'
              }
            }
          }
        }));
        // console.log(filepondData);
        setUrlsFromServer(filepondData);
        setIsLoading(false);
      } catch (error) {
        onError(error);
      }
    }
    if (attachments !== prevAttachments || !isEditingFiles) {
      setPrevAttachments(attachments);
      setFilesResized([]);
      onLoad();
    }
  }, [attachments, prevAttachments, isEditingFiles]);

  async function uploadFile(file) {
    try {
      const key = await s3Upload(file);
      const { width, height } = await getImageSize(file);
      if (isImage(file)) {
        return { key, type: file.type, width, height };
      } else {
        return { key, type: file.type };
      };
    } catch (error) {
      onError(error);
    }
  };

  async function uploadFiles(files=[]) {
    const attachmentsUploaded = await Promise.all(files.map(async ({ file }) => uploadFile(file)));
    return attachmentsUploaded;
  };

  async function deleteFile(filename) {
    try {
      const key = await s3Delete(filename);
      return { key };
    } catch (error) {
      onError(error);
    }
  }

  async function deleteFiles(urls=[]) {
    const confirmed = (urls.length > 0) ?
      window.confirm(`
      Do you want to delete images?
      ${urls.map(({ key }) => `\n${key}`)},
      `) : false;
    if (confirmed) {
      // setIsDeletingFiles(true);
      const filenames = urls.map(({ key }) => key);
      const attachmentsDeleted = await Promise.all(filenames.map(async (filename) => deleteFile(filename)));
      return attachmentsDeleted;
      // setIsDeletingFiles(false);
    } else {
      return [];
    }
  };

  async function handleUpdateFiles(files, urlsFromServer, filesResized, attachments) {
    setIsUpdatingFiles(true);
    // console.log('files', files);
    // console.log('urlsFromServer', urlsFromServer);
    const filesToUpload = files.filter(({ file }) => 
      !(urlsFromServer.some(({ key }) => (key === decodeURI(file.name)))));
    const filesResizedToUpload = filesToUpload.map(({ file }) =>
      (filesResized.find(({ filename }) => (filename === file.name))));
    // console.log('filesResizedToUpload', filesResizedToUpload);
    // console.log('filesToUpload', filesToUpload);
    const urlsToDelete = urlsFromServer.filter(({ key }) =>
      !(files.some(({ file }) => (decodeURI(file.name) === key))));
    // console.log('urlsToDelete', urlsToDelete);
    const attachmentsUploaded = await uploadFiles(filesResizedToUpload);
    const attachmentsDeleted = await deleteFiles(urlsToDelete);
    const attachmentsCurrent = JSON.parse(attachments);
    // console.log('attachmentsUploaded', attachmentsUploaded);
    // console.log('attachmentsDeleted', attachmentsDeleted);
    // console.log('attachmentsCurrent', attachmentsCurrent);
    const attachmentsUpdate = [ ...attachmentsCurrent, ...attachmentsUploaded ].filter(({ key }) =>
      !(attachmentsDeleted.some((attachment) => (decodeURI(attachment.key) === key))));
    // console.log('attachmentsUpdate', attachmentsUpdate);
    if (entityType === 'Item') {
      try {
        const data = await updateItem({
          variables: {
            item: {
              id: entityId,
              attachments: JSON.stringify(attachmentsUpdate)
            }
          }
        });
        if (data) {
          // console.log('data', data);
          setIsUpdatingFiles(false);
          setIsEditingFiles(false);
        }
      } catch (error) {
        onError(error);
      }
    }
    if (entityType === 'Action') {
      try {
        const data = await updateAction({
          variables: {
            action: {
              id: entityId,
              attachments: JSON.stringify(attachmentsUpdate)
            }
          }
        });
        if (data) {
          // console.log('data', data);
          setIsUpdatingFiles(false);
          setIsEditingFiles(false);
        }
      } catch (error) {
        onError(error);
      }
    }
  }
  // console.log(imageData[0])
  // console.log('files', files);
  // console.log('filesResized',filesResized)
  return(
    isLoading ? (
      <div
        className='Loading'
      >
        <ImSpinner2
          className='spinning'
        />
        {/* <Gallery
          photos={imageData}
        /> */}
      </div>
    ) : (
      // ((urlsFromServer && urlsFromServer.length > 0) || (files && files.length > 0)) &&
      <div className='ImageGrid'>
      <Row className='justify-content-end'>
        {!isEditingFiles ?
          (
            <LoadingButton
              className='LoadingButton'
              size='sm'
              color='orange'
              variant='outline-warning'
              disabled={false}
              type='submit'
              isLoading={false}
              onClick={() => setIsEditingFiles(true)}
            >
              {(files && files.length) ? 'Edit files' : 'Add files'}
            </LoadingButton>
          ) : (
            <>
              <LoadingButton
                className='LoadingButton'
                size='sm'
                variant='outline-primary'
                disabled={isUpdatingFiles}
                type='submit'
                isLoading={isUpdatingFiles}
                onClick={() => handleUpdateFiles(files, urlsFromServer, filesResized, attachments)}
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
                onClick={() => setIsEditingFiles(false)}
              >
                Cancel
              </LoadingButton>
              {/* <LoadingButton
                className='LoadingButton'
                size='sm'
                color='red'
                variant='outline-danger'
                disabled={isDeletingFiles}
                type='submit'
                isLoading={isDeletingFiles}
                onClick={() => handleDeleteFiles()}
              >
                Delete all images
              </LoadingButton> */}
            </>
          )
        }
      </Row>
      <hr style={{ marginBottom: 0 }}/>
      <FilePond
        className='FilepondInactive'
        files={!isEditingFiles ? urlsFromServer : files}
        server={!isEditingFiles ? {
          load: (source, load, error, progress, abort, headers) => {
            var myRequest = new Request(source);
            fetch(myRequest).then(function(response) {
              response.blob().then(function(myBlob) {
                load(myBlob);
              });
            });
          }
        } : null}
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
          // console.log('transformedFile', transformedFile);
          setFilesResized([ ...filesResized, { file: transformedFile, filename, fileType: type } ]);
        }}
        allowReorder={false}
        allowMultiple={true}
        maxFiles={3}
        onupdatefiles={setFiles}
        disabled={!isEditingFiles}
        labelIdle={isEditingFiles ? 'Drop files here or <span class="filepond--label-action">Browse</span>' : (entityType + ' files')}
        labelButtonDownloadItem={'Download file'} // by default 'Download file'
        allowDownloadByUrl={true} // by default downloading by URL disabled
        credits={false}
      />
      </div>
    )
  )
};

export default ImageGrid;