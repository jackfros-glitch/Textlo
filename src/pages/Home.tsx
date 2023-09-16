import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons/faStop";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import StopWatch from "../components/StopWatch";

const Home = () => {
  // state to store time
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Method to start and stop timer
  const startAndPause = () => {
    setIsRunning(!isRunning);
  };

  // Method to reset timer back to 0
  const reset = () => {
    setTime(0);
  };
  return (
    <>
      <div>
        <div className="container">
          <StopWatch time={time} />
          <div className="microphone-container">
            <button
              id="startPauseButton"
              className="mx-2 mr-3"
              onClick={startAndPause}
            >
              {isRunning ? (
                <FontAwesomeIcon
                  icon={faMicrophone}
                  size="2xl"
                  style={{ color: "blue" }}
                  beatFade
                />
              ) : (
                <FontAwesomeIcon
                  icon={faMicrophone}
                  size="2xl"
                  style={{ color: "blue" }}
                />
              )}
            </button>
            <button
              id="stopButton"
              className="mx-2 border border-blue-200 p-2 py-0 flex h-8 mr-3 items-center"
              onClick={reset}
            >
              <FontAwesomeIcon icon={faStop} style={{ color: "red" }} />
            </button>
            <button className="mx-2">
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                style={{ color: "blue" }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
