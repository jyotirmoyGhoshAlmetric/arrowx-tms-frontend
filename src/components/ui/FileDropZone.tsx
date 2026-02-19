import React, { useState, useCallback } from "react";
import { useDropzone, type FileRejection, type Accept } from "react-dropzone";
import uploadSvgImage from "@/assets/images/svg/upload.svg";

interface FileWithPreview extends File {
  preview: string;
  type: string;
}

const getFileTypeIcon = (fileType: string): string => {
  // Add more file type icons as needed
  const fileTypeMap: Record<string, string> = {
    "application/pdf": "📄",
    "application/msword": "📝",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "📝",
    "application/vnd.ms-excel": "📊",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
    "text/plain": "📄",
    "text/csv": "📊",
    default: "📎",
  };

  const mainType = fileType.split("/")[0];
  if (mainType === "image") return ""; // Return empty for images as we'll show actual preview

  return fileTypeMap[fileType] || fileTypeMap.default;
};

interface DropZoneProps {
  onFilesChange?: (files: FileWithPreview[]) => void;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  onError?: (error: FileRejection[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  onFilesChange,
  accept = { "image/*": [] },
  maxFiles = 1,
  maxSize = 5242880, // 5MB default
  className = "",
  multiple = true,
  children,
  onError,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0 && onError) {
        onError(rejectedFiles);
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ) as FileWithPreview[];

      setFiles(
        multiple
          ? [...files, ...newFiles].slice(0, maxFiles)
          : newFiles.slice(0, 1),
      );
      onFilesChange?.(
        multiple
          ? [...files, ...newFiles].slice(0, maxFiles)
          : newFiles.slice(0, 1),
      );
    },
    [files, maxFiles, multiple, onFilesChange, onError],
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept,
      maxSize,
      multiple,
      maxFiles,
      onDrop,
    });

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  return (
    <div className={className}>
      <div
        className={`w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] 
          flex flex-col justify-center items-center
          ${isDragAccept ? "border-green-500 bg-green-50" : ""}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}`}
      >
        {files.length === 0 && (
          <div
            {...getRootProps({ className: "dropzone w-full cursor-pointer" })}
          >
            <input {...getInputProps()} />
            {children || (
              <>
                <img src={uploadSvgImage} alt="" className="mx-auto mb-4" />
                {isDragAccept ? (
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Drop the files here ...
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Drop files here or click to upload.
                  </p>
                )}
              </>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {files.map((file, i) => (
            <div key={file.preview} className="mb-4 relative">
              <div className="h-[300px] w-[300px] rounded-md bg-gray-50 flex items-center justify-center">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    className="object-contain h-full w-full block rounded-md"
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                    alt={file.name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full p-4">
                    <span className="text-4xl mb-2">
                      {getFileTypeIcon(file.type)}
                    </span>
                    <p className="text-sm text-gray-600 break-all text-center">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
