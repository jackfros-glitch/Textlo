import React from "react";

interface Props {
  transcript: string;
}

const TextContainer = ({ transcript }: Props) => {
  return (
    <>
      <div className="h-[80%] border border-sky-500 w-[80%] m-auto mb-10 rounded overflow-hidden">
        <textarea className="h-full w-full resize-none outline-none p-2 text-current">
          {transcript}
        </textarea>
      </div>
    </>
  );
};

export default TextContainer;
