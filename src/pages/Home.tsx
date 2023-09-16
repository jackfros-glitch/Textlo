import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons/faStop";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";

const Home = () => {
  return (
    <>
      <div>
        <div className="microphone-container">
          <button className="mx-2 mr-3">
            <FontAwesomeIcon
              icon={faMicrophone}
              size="2xl"
              style={{ color: "blue" }}
            />
          </button>
          <button className="mx-2  mr-3">
            <FontAwesomeIcon icon={faStop} style={{ color: "blue" }} />
          </button>
          <button className="mx-2">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              style={{ color: "blue" }}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
