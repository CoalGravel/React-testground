import React from 'react';
import './cropper.css';

import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Cancel from '@mui/icons-material/Cancel';

import getCroppedImg, { generateDownload } from '../../utils/cropImage';
import { SnackbarContext } from '../snackbar/snackbar';
import { BackdropContext } from '../backdrop/backdrop';
import { dataURLtoFile } from '../../utils/dataURLtoFile';

export default function RenderCropper({ handleCropper, setAvatar }) {
  const inputRef = React.useRef();

  const triggerFileSelectPopup = () => inputRef.current.click();

  const setStateSnackbarContext = React.useContext(SnackbarContext);
  const { closeBackdrop, showBackdrop } = React.useContext(BackdropContext);

  const [image, setImage] = React.useState(null);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener('load', () => {
        setImage(reader.result);
      });
    }
  };

  const onDownload = () => {
    if (!image)
      return setStateSnackbarContext(
        true,
        'Please select an image!',
        'warning'
      );
    generateDownload(image, croppedArea);
  };

  const onClear = () => {
    if (!image)
      return setStateSnackbarContext(
        true,
        'Please select an image!',
        'warning'
      );

    setImage(null);
  };

  const onUpload = async () => {
    if (!image)
      return setStateSnackbarContext(
        true,
        'Please select an image!',
        'warning'
      );

    const canvas = await getCroppedImg(image, croppedArea);
    const canvasDataUrl = canvas.toDataURL('image/jpeg');
    const convertedUrlToFile = dataURLtoFile(
      canvasDataUrl,
      'cropped-image.jpeg'
    );
    // http://localhost:9000/api/users/setProfilePic
    console.log(convertedUrlToFile);

    try {
      const formdata = new FormData();
      formdata.append('croppedImage', convertedUrlToFile);

      showBackdrop();

      const res = await fetch('http://localhost:9000/api/users/setProfilePic', {
        method: 'POST',
        body: formdata
      });

      const res2 = await res.json();
      console.log(res2);
      closeBackdrop();
      setAvatar(res2.data);
    } catch (err) {
      closeBackdrop();
      console.warn(err);
    }
  };

  return (
    <div className='container'>
      <div className='cancel-button-container'>
        <IconButton
          style={{ marginRight: '10px', marginLeft: '10px' }}
          onClick={handleCropper}>
          <Cancel />
        </IconButton>
      </div>
      <div className='container-cropper'>
        {image ? (
          <>
            <div className='cropper'>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className='slider'>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
          </>
        ) : null}
      </div>

      <div className='container-buttons'>
        <input
          type='file'
          accept='image/*'
          ref={inputRef}
          onChange={onSelectFile}
          style={{ display: 'none' }}
        />
        <Button
          variant='contained'
          color='primary'
          style={{ marginRight: '5px', marginLeft: '5px' }}
          onClick={onClear}>
          Clear
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={triggerFileSelectPopup}
          style={{ marginRight: '5px', marginLeft: '5px' }}>
          Choose
        </Button>
        <Button
          variant='contained'
          color='secondary'
          style={{ marginRight: '5px', marginLeft: '5px' }}
          onClick={onDownload}>
          Download
        </Button>
        <Button
          variant='contained'
          color='secondary'
          style={{ marginRight: '5px', marginLeft: '5px' }}
          onClick={onUpload}>
          Upload
        </Button>
      </div>
    </div>
  );
}
