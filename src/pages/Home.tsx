import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons/faStop";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import StopWatch from "../components/StopWatch";

const Home = () => {
  return (
    <>
      <div>
        <div className="container">
          <StopWatch />
          <div className="microphone-container">
            <button className="mx-2 mr-3">
              <FontAwesomeIcon
                icon={faMicrophone}
                size="2xl"
                style={{ color: "blue" }}
              />
            </button>
            <button className="mx-2 border border-blue-200 p-2 py-0 flex h-8 mr-3 items-center">
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
