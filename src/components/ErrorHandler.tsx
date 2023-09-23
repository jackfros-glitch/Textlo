import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  error: { status: boolean; message: string };
  cancel: () => void;
}
const ErrorHandler = ({ error, cancel }: Props) => {
  return (
    <div id="overlay" className={`${error.status ? "flex" : "hidden"} `}>
      <div id="overlay__content">
        <p className="p-5">{error.message}</p>
        <button className="self-start" onClick={cancel}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;
