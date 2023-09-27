import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import StopWatch from "../components/StopWatch";
import TextContainer from "../components/TextContainer";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faStop } from "@fortawesome/free-solid-svg-icons/faStop";
import ErrorHandler from "../components/ErrorHandler";

interface ErrorInterface {
  status: boolean;
  message: string;
}

const Home = () => {
  // state to store time
  const initialState = { status: false, message: "" };
  const [time, setTime] = useState(0);
  const [error, setError] = useState<ErrorInterface>(initialState);
  const [showMenu, setShowMenu] = useState(false);
  const [currentMode, setCurrentMode] = useState("");

  const {
    isMicrophoneAvailable,
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const checkMicrophonePermissions = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  };

  const checkBrowserSupport = () => {
    if (!browserSupportsSpeechRecognition) {
      let message =
        "Your Browser doesn't support speech recognition. Please Use Chrome Browser for better performance";
      setError({
        status: true,
        message,
      });
    }
  };

  const checkMicrophoneAvailability = () => {
    if (!isMicrophoneAvailable) {
      let message = "Microphone is not Available";
      setError({
        status: true,
        message,
      });
    }
  };
  useEffect(() => {
    let intervalId: number;
    if (listening) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [listening, time]);

  useEffect(() => {
    // Request access to the user's microphone
    checkMicrophonePermissions();
    checkBrowserSupport();
    checkMicrophoneAvailability();
  }, []);

  // Method to start and stop timer
  const startAndPause = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
      return;
    }
    SpeechRecognition.stopListening();
  };

  // Method to reset timer back to 0
  const reset = () => {
    setTime(0);
    if (listening) {
      SpeechRecognition.stopListening();
    }
    resetTranscript();
  };

  const cancel = () => {
    setError({
      status: false,
      message: "",
    });
  };
  const handleShowMenu = () => {
    if (!showMenu) {
      setShowMenu(true);
      return;
    }
    setShowMenu(false);
  };

  const handleMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    let mode = e.currentTarget.dataset.mode;
    setCurrentMode(mode);
  };
  return (
    <>
      <ErrorHandler error={error} cancel={cancel} />
      <div className="h-full">
        <div className="container">
          <StopWatch time={time} />
          <div className="microphone-container">
            <button
              id="startPauseButton"
              className="mx-2 mr-3"
              onClick={startAndPause}
            >
              {listening ? (
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
              className="mx-2 border border-blue-200 p-2 py-0 flex h-8 mr-3 items-center rounded-sm"
              onClick={reset}
            >
              <FontAwesomeIcon icon={faStop} style={{ color: "red" }} />
            </button>
            <div
              className="wrapper relative border border-blue-200 rounded-sm"
              onClick={handleShowMenu}
            >
              <button className="mx-2">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  style={{ color: "blue" }}
                />
              </button>
              {showMenu ? (
                <div className="dropdown">
                  <a
                    className="item"
                    onClick={(e) => handleMode(e)}
                    data-mode={1}
                  >
                    Real Time
                  </a>
                  <a
                    className="item"
                    onClick={(e) => handleMode(e)}
                    data-mode={2}
                  >
                    Record and Transcribe
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <TextContainer transcript={transcript} />
      </div>
    </>
  );
};

export default Home;
