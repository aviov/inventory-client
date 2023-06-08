import React, { useState, useEffect } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { s3FileURL } from '../libs/awsLib';
import { onError } from "../libs/errorLib";
import Image from 'react-bootstrap/Image';

function ImagePreview({ filename }) {
  const [imageURL, setImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    async function onLoad() {
      if (!filename) {
        return null;
      }
      try {
        const url = await s3FileURL(filename);
        setImageURL(url);
        setIsLoading(false);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  }, [filename]);
  
  if (isLoading) {
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

  return (
    <Image
      className='justify-content-md-center'
      fluid
      src={imageURL}
    />
  )
};

export default ImagePreview;