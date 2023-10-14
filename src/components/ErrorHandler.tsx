import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  error: { status: boolean; message: string };
  cancel: () => void;
}
const ErrorHandler = ({ error, cancel }: Props) => {
  return (
    <div className={`${error.status ? "flex" : "hidden"} overlay`}>
      <div className="overlay__content">
        <p className="p-5 ml-5 w-5/6 text-center">{error.message}</p>
        <button className="self-start ml-auto" onClick={cancel}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;
