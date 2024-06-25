import React, { useEffect, useState } from 'react';
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
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
import 'filepond-plugin-get-file/dist/filepond-plugin-get-file.min.css';
import LoadingButton from './LoadingButton';
import { useMutation } from '@apollo/client'
import { MUTATION_updateItem } from '../api/mutations'
import { MUTATION_updateAction } from '../api/mutations';
import { s3FileURL } from '../libs/awsLib';
import { s3Upload, s3Delete } from '../libs/awsLib';
import { isEqualLengthsAndValuesByKey } from '../libs/fnsLib';
import { isImage, getImageSize } from '../libs/imageLib';
import { onError } from '../libs/errorLib';
import './ImageGrid.css';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginMediaPreview,
  FilePondPluginGetFile,
  FilePondPluginFileRename
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
      try {
        console.log(attachments);
        const filepondData = await Promise.all(JSON.parse(attachments).map(async ({ key, type, width, height }) => {
          const source = await s3FileURL(key);
          if (isImage({ type })) {
            return source;
          } else {
            return source;
          }
        }));
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

  async function uploadFile({ filename, file }) {
    try {
      const key = await s3Upload({ filename, file });
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
    const attachmentsUploaded = await Promise.all(files.map(async ({ filename, file }) => await uploadFile({ filename, file })));
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
      ${urls.map(({ name }) => `\n${name}`)},
      `) : false;
    if (confirmed) {
      // setIsDeletingFiles(true);
      const filenames = urls.map(({ name }) => name);
      const attachmentsDeleted = await Promise.all(filenames.map(async (name) => await deleteFile(name)));
      return attachmentsDeleted;
      // setIsDeletingFiles(false);
    } else {
      return [];
    }
  };

  async function handleUpdateFiles(files, urlsFromServer, filesResized, attachments) {
    setIsUpdatingFiles(true);
    const filesToUpload = files.filter((file) => 
      !(urlsFromServer.find((fileFromServer) => (fileFromServer.name === file.filename))));
    const urlsToDelete = urlsFromServer.filter((fileFromServer) =>
      !files.find((file) => {
        console.log('file.filename', file.filename, 'fileFromServer.name', fileFromServer.name);
        return file.filename === fileFromServer.name
      }));
    // console.log('filesToUpload', filesToUpload);
    // console.log('urlsToDelete', urlsToDelete);
    let attachmentsUpdate = JSON.parse(attachments);
    if (filesToUpload.length > 0) {
      const attachmentsUploaded = await uploadFiles(filesToUpload);
      console.log('attachmentsUploaded', attachmentsUploaded);
      attachmentsUpdate = [...attachmentsUpdate, ...attachmentsUploaded];
    }
    if (urlsToDelete.length > 0) {
      const attachmentsDeleted = await deleteFiles(urlsToDelete);
      console.log('attachmentsDeleted', attachmentsDeleted);
      attachmentsUpdate = attachmentsUpdate.filter(({ key }) =>
        !attachmentsDeleted.find(attDeleted => (key === attDeleted.key)));
      // console.log('attArr', attArr);
      // console.log('attachmentsUpdate', attachmentsUpdate);
    }
    // console.log('attachmentsUpdate', attachmentsUpdate);
    // console.log('JSON.parse(attachments)', JSON.parse(attachments));
    if (!isEqualLengthsAndValuesByKey(JSON.parse(attachments), attachmentsUpdate, 'key')) {
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
            setIsUpdatingFiles(false);
            setIsEditingFiles(false);
          }
        } catch (error) {
          onError(error);
        }
      }
    } else {
      setIsUpdatingFiles(false);
      setIsEditingFiles(false);
    }
  }
  // console.log('files', files);
  // console.log('urlsFromServer', urlsFromServer);
  return(
    isLoading ? (
      <div
        className='Loading'
      >
        <ImSpinner2
          className='spinning'
        />
      </div>
    ) : (
      // ((urlsFromServer && urlsFromServer.length > 0) || (files && files.length > 0)) &&
      <div className='ImageGrid'>
        <div className="d-flex justify-content-end">
          {!isEditingFiles ?
            (
              <LoadingButton
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
        </div>
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
          acceptedFileTypes={['image/*']}
          labelFileTypeNotAllowed={'Only image can be uploaded'}
          allowFileSizeValidation={true}
          maxFileSize={'7MB'}
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
          allowFileRename={false}
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