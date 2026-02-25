"use client";
import { ReactIcons } from "@/public";
import { showSnackbar, SnackbarEnum } from "@/utils/utils";
import React, {
  ChangeEvent,
  Dispatch,
  DragEvent,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

type FileDropZoneProps = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
};

const FontDropBox: FC<FileDropZoneProps> = ({
  files,
  setFiles,
  extensions,
}) => {
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = extensions ? extensions.join(",") : "";

  const isValidFile = (file: File) => {
    const isValid = extensions
      ? extensions.some((ext) => file.name.toLowerCase().endsWith(ext))
      : true;

    if (!isValid) {
      showSnackbar(
        `File "${file.name}" is not a valid format (${extensions?.join(", ")})`,
        SnackbarEnum.Warning,
      );
    }

    return isValid;
  };

  const handleFileAdd = (file: File) => {
    if (!isValidFile(file)) return;
    setFiles([file]);
  };

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropZoneActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && isValidFile(droppedFile)) {
      handleFileAdd(droppedFile);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    handleFileAdd(files[0]);
    event.target.value = "";
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      setDropZoneActive(true);
      event.preventDefault();
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setDropZoneActive(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setFiles([]);
  };

  return (
    <div className="flex gap-4 items-center">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`${
          dropZoneActive ? "" : ""
        } flex gap-3 bg-backgroundContainer grow items-center justify-center rounded-2xl text-center cursor-pointer duration-400`}
      >
        {files.length > 0 ? (
          <>
            {files.map((file, index) => {
              return (
                <div
                  key={index}
                  className="flex w-full items-center justify-start gap-2 md:gap-4 rounded-2xl p-2 border-1"
                >
                  <ReactIcons.File />
                  <div className="flex flex-col items-start grow">
                    <p className="heading5">{file.name}</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex items-center justify-center max-md:p-3 gap-2 md:gap-5">
            <span
              className={`${
                dropZoneActive
                  ? "text-success scale-125"
                  : "text-outline scale-100"
              } flex items-center justify-center rounded-2xl p-2 duration-400`}
            >
              <ReactIcons.FileUpload />
            </span>
            <p
              className={`${
                dropZoneActive
                  ? "text-success scale-110"
                  : "text-outline scale-100"
              } duration-400`}
            >
              <span>{`Drag and drop files here`}</span>
              <span className="text-onBackground">{` or `}</span>
              <span className="text-primary font-semibold underline">{`Browse Files`}</span>
              {extensions && (
                <>
                  <span>{`  (${extensions})`}</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={acceptString}
      />
      {files.length > 0 && (
        <span
          className=" text-danger rounded-full hover:bg-danger hover:text-onPrimary duration-400 cursor-pointer "
          onClick={handleRemove}
        >
          <ReactIcons.CloseCircle />
        </span>
      )}
    </div>
  );
};

export default FontDropBox;
