import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import StopWatch from "../components/StopWatch";
import TextContainer from "../components/TextContainer";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { faStop } from "@fortawesome/free-solid-svg-icons/faStop";
import ErrorHandler from "../components/ErrorHandler";
import { fetchTranscript } from "../utils";
import Footer from "../components/Footer";

interface ErrorInterface {
  status: boolean;
  message: string;
}

const Home = () => {
  // state to store time
  const initialState = { status: false, message: "" };
  const [time, setTime] = useState<number>(0);
  const [error, setError] = useState<ErrorInterface>(initialState);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<string | undefined>("1");
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder: MutableRefObject<MediaRecorder | null> = useRef(null);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    isMicrophoneAvailable,
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const checkMicrophonePermissions = async () => {
    if ("MediaRecorder" in window) {
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (err: any) {
        let message = err.message;
        setError({ status: true, message });
      }
    } else {
      let message =
        "The MediaRecorder API is not supported in your browser, Please try Using Chrome.";
      setError({
        status: true,
        message,
      });
    }
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
    let intervalId: undefined | ReturnType<typeof setTimeout>;
    if (listening || recording) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    if (currentMode === "2") {
      if (audio && audioChunks.length !== 0) {
        fetchTranscript(audio).then((data) => {
          setData(data);
          setLoading(false);
        });
      }
    }

    return () => clearInterval(intervalId);
  }, [listening, time, recording, audio]);

  useEffect(() => {
    // Request access to the user's microphone
    checkMicrophonePermissions().then((stream) => setStream(stream));
    checkBrowserSupport();
    checkMicrophoneAvailability();
  }, []);

  // Method to start and pause the recorder
  const startAndPause = async () => {
    if (currentMode == "1") {
      if (!listening) {
        SpeechRecognition.startListening({ continuous: true });
        return;
      }
      SpeechRecognition.stopListening();
      return;
    } else {
      if (mediaRecorder.current) {
        if (mediaRecorder.current.state === "paused") {
          mediaRecorder.current.resume();
          setRecording(true);
        } else if (mediaRecorder.current.state == "recording") {
          mediaRecorder.current.pause();
          setRecording(false);
        }
      } else {
        if (stream) {
          const media = new MediaRecorder(stream);
          //set the MediaRecorder instance to the mediaRecorder ref
          mediaRecorder.current = media;
          //invokes the start method to start the recording process
          mediaRecorder.current.start();
          setRecording(true);
          let localAudioChunks: Blob[] = [];
          setAudioChunks([]);
          mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
            const audioBlob = new Blob(localAudioChunks, {
              type: "audio/webm",
            });
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioBlob);
            setAudioChunks([...localAudioChunks]);
          };
        }
      }
    }
  };

  const reset = () => {
    if (currentMode == "1") {
      setTime(0);
      if (listening) {
        SpeechRecognition.stopListening();
      }
      resetTranscript();
    } else {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setRecording(false);
        setLoading(true);
      }
      // TODO: SET THE DATA VARIABLE TO AN EMPTY STRING
      mediaRecorder.current = null;
      setTime(0);
    }
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
    let mode: string | undefined = e.currentTarget.dataset.mode;
    if (listening) {
      SpeechRecognition.stopListening();
    }
    if (recording) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }
      setRecording(false);
    }
    resetTranscript();
    setData("");
    setTime(0);
    setCurrentMode(mode);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(e.currentTarget.value);
  };

  return (
    <>
      <ErrorHandler error={error} cancel={cancel} />
      {loading ? (
        <div className="overlay flex">
          <div className="loader "></div>
        </div>
      ) : (
        ""
      )}
      <p className="text-center pb-0 m-0 pt-2">
        Mode : {currentMode === "1" ? "Real Time" : "Record and Transcribe"}
      </p>
      <div className="h-full">
        <div className="container">
          <StopWatch time={time} />

          <div className="microphone-container">
            <button
              id="startPauseButton"
              className="mx-2 mr-3"
              onClick={startAndPause}
            >
              {listening || recording === true ? (
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
                    className={"item"}
                    onClick={(e) => handleMode(e)}
                    data-mode={1}
                  >
                    Real Time
                  </a>
                  <a
                    className={"item "}
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

        {data && currentMode === "2" ? (
          <TextContainer
            transcript={data}
            onChange={(e) => handleOnChange(e)}
          />
        ) : (
          <TextContainer transcript={transcript} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
