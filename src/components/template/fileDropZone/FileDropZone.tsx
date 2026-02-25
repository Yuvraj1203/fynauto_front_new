"use client";

import { ReactIcons } from "@/public";
import { useTenantDataStore } from "@/store/zustandStore";
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
  setFiles: Dispatch<SetStateAction<File[]>>;
  extensions?: string[];
  hasCustomFunction?: boolean;
  fileUploadFunction?: (prev: File[], incoming: File[]) => File[];
};

const FileDropZone: FC<FileDropZoneProps> = ({
  setFiles,
  extensions,
  hasCustomFunction = false,
  fileUploadFunction,
}) => {
  const setTenantFilesStores = useTenantDataStore().setFilesConfig; // store

  const [dropZoneActive, setDropZoneActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  //considered extension
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

  const removeDuplicacy = (prev: File[], droppedFiles: File[]): File[] => {
    const newFiles = [...prev, ...droppedFiles];
    const uniqueFiles = Array.from(
      new Map(
        newFiles.map((file) => [`${file.name}-${file.size}`, file]),
      ).values(),
    );
    return uniqueFiles;
  };

  const uploadFilesFunction = (prev: File[], incoming: File[]): File[] => {
    let response;
    if (hasCustomFunction && fileUploadFunction) {
      response = fileUploadFunction(prev, incoming);
    } else {
      response = removeDuplicacy(prev, incoming);
    }
    setTenantFilesStores(response);
    return response;
  };

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropZoneActive(false);
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      isValidFile,
    );
    console.log(droppedFiles);
    setFiles((prev) => uploadFilesFunction(prev, droppedFiles));
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const droppedFiles = Array.from(files).filter(isValidFile);
    console.log(droppedFiles);
    setFiles((prev) => uploadFilesFunction(prev, droppedFiles));
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

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`${
          dropZoneActive
            ? "border-success border-double"
            : "border-outline border-dashed"
        } flex flex-col gap-5 m-5 items-center border-2 rounded-2xl p-6 text-center cursor-pointer duration-400`}
      >
        <span
          className={`${
            dropZoneActive
              ? "text-success scale-125 rotate-45"
              : "text-outline scale-100"
          } flex items-center justify-center size-10 shadow-lightShadow rounded-2xl duration-400 `}
        >
          <ReactIcons.FileUpload />
        </span>
        <p
          className={`${
            dropZoneActive ? "text-success scale-110" : "text-outline scale-100"
          } duration-400`}
        >
          <span>{`Drag and drop files here`}</span>
          <span className="text-onBackground">{` or `}</span>
          <span className="text-primary font-semibold underline">{`Browse Files`}</span>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={acceptString}
            multiple
          />
          {extensions && (
            <>
              <br />
              <span>{`(${extensions})`}</span>
            </>
          )}
        </p>
      </div>
    </>
  );
};

export default FileDropZone;
