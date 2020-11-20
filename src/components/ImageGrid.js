import React, { useEffect, useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import Gallery from 'react-photo-gallery';
import { s3FileURL } from '../libs/awsLib';
import { isImage } from '../libs/imageLib';
import { onError } from '../libs/errorLib';

function ImageGrid({ attachments='[]' }) {
  const [prevAttachments, setPrevAttachments] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);
      // console.log(attachments);
      try {
        const galleryData = await Promise.all(JSON.parse(attachments).map(async ({ key, type, width, height }) => {
          const src = await s3FileURL(key);
          if (isImage({ type })) {
            return { src, width, height }
          } else {
            return { src: '/images/file-icon-420x420.png', width: 192, height: 192 }
          }
        }));
        setImageData(galleryData);
        setIsLoading(false);
      } catch (error) {
        onError(error);
      }
    }
    if (attachments !== prevAttachments) {
      setPrevAttachments(attachments);
      onLoad();
    }
  }, [attachments, prevAttachments]);
  // console.log(imageData[0])
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
      <Gallery
        photos={imageData}
      />
    )
  )
};

export default ImageGrid;