import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const BackdropContext = React.createContext();

export default function SimpleBackdrop({ children }) {
  const [open, setOpen] = React.useState(false);
  const closeBackdrop = () => {
    setOpen(false);
  };
  const showBackdrop = () => {
    setOpen(!open);
  };

  return (
    <BackdropContext.Provider value={{ closeBackdrop, showBackdrop }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        //   onClick={closeBackdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      {children}
    </BackdropContext.Provider>
  );
}
