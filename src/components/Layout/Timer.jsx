import React, { useState, useEffect } from 'react';

const Timer = ({ 
  initialSeconds = 0, 
  isActive = false, 
  onToggle, 
  onTimeUpdate,
  showControls = true,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [timerActive, setTimerActive] = useState(isActive);

  // Format time to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Handle toggle timer
  const toggleTimer = () => {
    if (onToggle) {
      onToggle(!timerActive);
    }
    setTimerActive(!timerActive);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          // Call callback if provided
          if (onTimeUpdate) {
            onTimeUpdate(newSeconds);
          }
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, onTimeUpdate]);

  return (
    <div className="inline-flex items-center text-xs gap-1">
      {showControls && (
        <div
          title={timerActive ? 'Pause' : 'Play'}
          onClick={toggleTimer}
          className="cursor-pointer hover:text-gray-600"
        >
          <svg className={`h-4 w-4 ${timerActive ? 'text-blue-600' : 'text-red-600'}`} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
          </svg>
        </div>
      )}
      <span className="font-medium">{formatTime(seconds)}</span>
    </div>
  );
};

export default React.memo(Timer);