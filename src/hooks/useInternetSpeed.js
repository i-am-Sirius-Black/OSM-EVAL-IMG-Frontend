// import { useState, useEffect } from 'react';
// import SpeedTest from '@cloudflare/speedtest';

// const useInternetSpeed = () => {
//   const [speed, setSpeed] = useState(null);

//   useEffect(() => {
//     const speedTest = new SpeedTest();

//     // Set up the onFinish callback to handle results
//     speedTest.onFinish = (results) => {
//       const summary = {
//         download: (results.download / 1e6).toFixed(2), // Convert to Mbps
//         upload: (results.upload / 1e6).toFixed(2),     // Convert to Mbps
//         latency: results.latency.toFixed(2),           // Latency in ms
//       };
//       setSpeed(summary);
//     };

//     // Start the speed test
//     speedTest.start();

//     // Cleanup function to stop the speed test if the component unmounts
//     return () => {
//       speedTest.stop();
//     };
//   }, []);

//   return speed;
// };

// export default useInternetSpeed;