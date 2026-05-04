import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';
import { Box } from '@mui/material';

function SplineModel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = new Application(canvasRef.current);
    app.load('https://prod.spline.design/rq-lWr7061VzZzwP/scene.splinecode');

    return () => app.dispose(); // Cleanup the app when the component unmounts
  }, []);

  return (
    <>
      <Box
        sx={{
          justifyContent: 'center',
          width: '100%',
          height: '50%',
          padding: '10px'
        }}
      >
        <canvas
          className='appbarfotter'
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        />
      </Box>
    </>
  );
}

export default SplineModel;
