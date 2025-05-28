import React, { useEffect, useRef, useState } from 'react'
import { CiDark, CiLight } from 'react-icons/ci';

const StopWatch = () => {
  
  // State variables
  const [isStarted, setIsStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastLapTimeRef = useRef(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Effect to handle the stopwatch timing
  // It starts the timer when isStarted is true and updates elapsedTime every 10ms
  useEffect(() => {
    if (isStarted) {
      startTimeRef.current = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => clearInterval(intervalRef.current);
  }, [isStarted]);

  // Effect to handle dark mode
  // It adds or removes the 'light' class on the body based on isDarkMode state
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
    // Optional: cleanup to remove class on unmount
    return () => document.body.classList.remove('light');
  }, [isDarkMode]);

  // Functions to control the stopwatch
  // start: sets isStarted to true
  const start = () => {
    setIsStarted(true);
  }

  // stop: sets isStarted to false
  // It does not reset elapsedTime or laps
  const stop = () => {
    setIsStarted(false);
  }

  // reset: sets isStarted to false, resets elapsedTime and laps
  // It also resets lastLapTimeRef to 0
  const reset = () => {
    setIsStarted(false);
    setElapsedTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  }

  // handleLap: calculates the lap time based on elapsedTime and lastLapTimeRef
  // It updates the laps state with the new lap time and resets lastLapTimeRef
  const handleLap = () => {
    const lapTime = elapsedTime - lastLapTimeRef.current;
    setLaps(prev => [...prev, lapTime]);
    lastLapTimeRef.current = elapsedTime;
  }

  // formatTime: formats the elapsed time into a string of "MM:SS:MS"
  const formatTime = (time = elapsedTime) => {
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time % 1000) / 10);
    return (
      <>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}:
        {milliseconds.toString().padStart(2, '0')}
        
      </>
    );
  }

  return (

    <div className='stopwatch'>

      <h1 className='header'>Stop Watch</h1>
      
      <div className="display">
        <span className="mode">
          {isDarkMode ? 
          <CiLight  onClick={()=>setIsDarkMode(false)}/> :
          <CiDark onClick={()=> setIsDarkMode(true)}/>
          }
        </span>
        {formatTime()}
      </div>

      <div className="controls">
        {!isStarted && elapsedTime === 0 ? 
          <button className="btn start" onClick={start}>Start</button> 
        : !isStarted && elapsedTime !== 0 ? 
          <button className='btn resume' onClick={start}>Resume</button> :
          <button className="btn stop" onClick={stop}>Stop</button>
        }
        <button className="btn reset" onClick={reset}>Reset</button>
        {isStarted && elapsedTime!== 0 ? <button className="btn lap" onClick={handleLap}>Lap</button> : null}
      </div>

      <div className="lapse-container">
        {laps.slice(-5).map((lap, index, arr) => (
          <div key={laps.length - arr.length + index} className="lap">
            <p>Lap {laps.length - arr.length + index + 1}: {formatTime(lap)}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default StopWatch;
