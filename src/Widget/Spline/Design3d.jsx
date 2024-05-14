import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

function SplineModel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = new Application(canvasRef.current);
    app.load('https://prod.spline.design/rq-lWr7061VzZzwP/scene.splinecode');

    return () => app.dispose(); // Cleanup the app when the component unmounts
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default SplineModel;
