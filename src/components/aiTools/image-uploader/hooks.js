import { useCallback, useMemo, useRef, useState } from "react";
import { imageUpload } from "./utils";
import { toast } from "react-toastify";
import { ALLOW_FILE_EXTENSIONS, TransferMethod } from "./types";

export const useImageFiles = ({ currentAppToken }) => {
  const [files, setFiles] = useState([]);
  const filesRef = useRef([]);

  const handleUpload = useCallback((imageFile) => {
    const files = filesRef.current;
    const index = files.findIndex((file) => file._id === imageFile._id);

    if (index > -1) {
      const currentFile = files[index];
      const newFiles = [
        ...files.slice(0, index),
        { ...currentFile, ...imageFile },
        ...files.slice(index + 1),
      ];
      setFiles(newFiles);
      filesRef.current = newFiles;
    } else {
      const newFiles = [...files, imageFile];
      setFiles(newFiles);
      filesRef.current = newFiles;
    }
  }, []);

  const handleRemove = useCallback((imageFileId) => {
    const files = filesRef.current;
    const index = files.findIndex((file) => file._id === imageFileId);

    if (index > -1) {
      const currentFile = files[index];
      const newFiles = [
        ...files.slice(0, index),
        { ...currentFile, deleted: true },
        ...files.slice(index + 1),
      ];
      setFiles(newFiles);
      filesRef.current = newFiles;
    }
  }, []);

  const handleImageLinkLoadError = useCallback((imageFileId) => {
    const files = filesRef.current;
    const index = files.findIndex((file) => file._id === imageFileId);

    if (index > -1) {
      const currentFile = files[index];
      const newFiles = [
        ...files.slice(0, index),
        { ...currentFile, progress: -1 },
        ...files.slice(index + 1),
      ];
      filesRef.current = newFiles;
      setFiles(newFiles);
    }
  }, []);

  const handleImageLinkLoadSuccess = useCallback((imageFileId) => {
    const files = filesRef.current;
    const index = files.findIndex((file) => file._id === imageFileId);

    if (index > -1) {
      const currentImageFile = files[index];
      const newFiles = [
        ...files.slice(0, index),
        { ...currentImageFile, progress: 100 },
        ...files.slice(index + 1),
      ];
      filesRef.current = newFiles;
      setFiles(newFiles);
    }
  }, []);

  const handleReUpload = useCallback(
    (imageFileId) => {
      const files = filesRef.current;
      const index = files.findIndex((file) => file._id === imageFileId);

      if (index > -1) {
        const currentImageFile = files[index];
        imageUpload(
          {
            file: currentImageFile.file,
            onProgressCallback: (progress) => {
              const newFiles = [
                ...files.slice(0, index),
                { ...currentImageFile, progress },
                ...files.slice(index + 1),
              ];
              filesRef.current = newFiles;
              setFiles(newFiles);
            },
            onSuccessCallback: (res) => {
              const newFiles = [
                ...files.slice(0, index),
                { ...currentImageFile, fileId: res.id, progress: 100 },
                ...files.slice(index + 1),
              ];
              filesRef.current = newFiles;
              setFiles(newFiles);
            },
            onErrorCallback: () => {
              toast.error("Image upload failed, please upload again.");
              const newFiles = [
                ...files.slice(0, index),
                { ...currentImageFile, progress: -1 },
                ...files.slice(index + 1),
              ];
              filesRef.current = newFiles;
              setFiles(newFiles);
            },
          },
          currentAppToken
        );
      }
    },
    [currentAppToken]
  );

  const handleClear = useCallback(() => {
    setFiles([]);
    filesRef.current = [];
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((file) => !file.deleted);
  }, [files]);

  return {
    files: filteredFiles,
    onUpload: handleUpload,
    onRemove: handleRemove,
    onImageLinkLoadError: handleImageLinkLoadError,
    onImageLinkLoadSuccess: handleImageLinkLoadSuccess,
    onReUpload: handleReUpload,
    onClear: handleClear,
  };
};

export const useLocalFileUploader = ({
  limit,
  disabled = false,
  onUpload,
  currentAppToken,
}) => {
  const handleLocalFileUpload = useCallback(
    (file) => {
      if (disabled) {
        // TODO: leave some warnings?
        return;
      }

      if (!ALLOW_FILE_EXTENSIONS.includes(file.type.split("/")[1])) return;

      if (limit && file.size > limit * 1024 * 1024) {
        toast.info(`Upload images cannot exceed ${limit * 1024 * 1024} MB`);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          const imageFile = {
            type: TransferMethod.local_file,
            _id: `${Date.now()}`,
            fileId: "",
            file,
            url: reader.result,
            base64Url: reader.result,
            progress: 0,
          };
          onUpload(imageFile);
          imageUpload(
            {
              file: imageFile.file,
              onProgressCallback: (progress) => {
                onUpload({ ...imageFile, progress });
              },
              onSuccessCallback: (res) => {
                onUpload({ ...imageFile, fileId: res.id, progress: 100 });
              },
              onErrorCallback: () => {
                toast.error("Image upload failed, please upload again.");
                onUpload({ ...imageFile, progress: -1 });
              },
            },
            currentAppToken
          );
        },
        false
      );
      reader.addEventListener(
        "error",
        () => {
          toast.error("Image reading failed, please try again.");
        },
        false
      );
      reader.readAsDataURL(file);
    },
    [disabled, limit, onUpload, currentAppToken]
  );

  return { disabled, handleLocalFileUpload };
};

export const useClipboardUploader = ({
  visionConfig,
  onUpload,
  files,
  currentAppToken,
}) => {
  const allowLocalUpload = visionConfig?.transfer_methods?.includes(
    TransferMethod.local_file
  );
  const disabled = useMemo(
    () =>
      !visionConfig ||
      !visionConfig?.enabled ||
      !allowLocalUpload ||
      files.length >= visionConfig.number_limits,
    [allowLocalUpload, files.length, visionConfig]
  );
  const limit = useMemo(
    () => (visionConfig ? +visionConfig.image_file_size_limit : 0),
    [visionConfig]
  );
  const { handleLocalFileUpload } = useLocalFileUploader({
    limit,
    onUpload,
    disabled,
    currentAppToken,
  });

  const handleClipboardPaste = useCallback(
    (e) => {
      // reserve native text copy behavior
      const file = e.clipboardData?.files[0];
      // when copied file, prevent default action
      if (file) {
        e.preventDefault();
        handleLocalFileUpload(file);
      }
    },
    [handleLocalFileUpload]
  );

  return {
    onPaste: handleClipboardPaste,
  };
};

export const useDraggableUploader = ({
  visionConfig,
  onUpload,
  files,
  currentAppToken,
}) => {
  const allowLocalUpload = visionConfig?.transfer_methods?.includes(
    TransferMethod.local_file
  );
  const disabled = useMemo(
    () =>
      !visionConfig ||
      !visionConfig?.enabled ||
      !allowLocalUpload ||
      files.length >= visionConfig.number_limits,
    [allowLocalUpload, files.length, visionConfig]
  );
  const limit = useMemo(
    () => (visionConfig ? +visionConfig.image_file_size_limit : 0),
    [visionConfig]
  );
  const { handleLocalFileUpload } = useLocalFileUploader({
    disabled,
    onUpload,
    limit,
    currentAppToken,
  });
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragActive(true);
    },
    [disabled]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];

      if (!file) return;

      handleLocalFileUpload(file);
    },
    [handleLocalFileUpload]
  );

  return {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    isDragActive,
  };
};
