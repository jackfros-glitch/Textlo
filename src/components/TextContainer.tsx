import React from "react";

interface Props {
  transcript: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextContainer = ({ transcript, onChange }: Props) => {
  return (
    <>
      <div className="h-[80%] border border-sky-500 w-[80%] m-auto mb-10 rounded overflow-hidden textarea-container">
        <textarea
          className="h-full w-full resize-none outline-none p-2 text-current"
          value={transcript}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange?.(e)
          }
        ></textarea>
      </div>
    </>
  );
};

export default TextContainer;
