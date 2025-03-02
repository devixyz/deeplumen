import React, {
  memo,
  useRef,
  useState,
  useContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import Textarea from "rc-textarea";
import ChatImageUploader from "./image-uploader/uploadOnlyFromLocal";
import ImageList from "./image-uploader/imageList";
import {
  useClipboardUploader,
  useDraggableUploader,
  useImageFiles,
} from "./image-uploader/hooks";
import DeepIcon from "~/components/arIcon";
// import Tooltip from "@/components/tooltip";
import { useRecoilValue, useRecoilState } from "recoil";
import store from "~/store";
import SearchIcon from "~/components/svg/SearchIcon";
import TargetIcon from "~/components/svg/TargetIcon";
import MessageIcon from "~/components/svg/MessageIcon";
import O1Icon from "~/components/svg/O1Icon";
const ChatInput = forwardRef(
  (
    {
      visionConfig,
      speechToTextConfig,
      onSend,
      theme,
      currentAppToken,
      currentApp,
      onChangeQuery,
      onKeyDown: handleKeyDownProps,
      StopButton,
      isResponding,
      handleRestart,
      inputRef,
    },
    ref
  ) => {
    const {
      files,
      onUpload,
      onRemove,
      onReUpload,
      onImageLinkLoadError,
      onImageLinkLoadSuccess,
      onClear,
    } = useImageFiles({ currentAppToken });
    const { onPaste } = useClipboardUploader({
      onUpload,
      visionConfig,
      files,
      currentAppToken,
    });
    const { onDragEnter, onDragLeave, onDragOver, onDrop, isDragActive } =
      useDraggableUploader({ onUpload, files, visionConfig, currentAppToken });

    const isUseInputMethod = useRef(false);
    const [query, setQuery] = useState("");
    const [text, setText] = useRecoilState(store.text);

    useEffect(() => {
      if (text && text !== "") {
        setQuery(text);
        setText("");
      }
    }, [text]);

    useImperativeHandle(ref, () => ({
      getQuery: () => query,
      setQuery: (newQuery) => setQuery(newQuery),
    }));

    const handleContentChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      onChangeQuery && onChangeQuery(value);
    };

    const handleSend = () => {
      if (onSend) {
        if ((!query || !query.trim()) && !currentApp?.upload_prompt) {
          return;
        }
        onSend(
          query || currentApp?.upload_prompt,
          files
            .filter((file) => file.progress !== -1)
            .map((fileItem) => ({
              type: "image",
              transfer_method: fileItem.type,
              url: fileItem.url,
              upload_file_id: fileItem.fileId,
            }))
        );
        setQuery("");
        onChangeQuery && onChangeQuery("");
        onClear();
      }
    };

    const handleKeyUp = (e) => {
      isUseInputMethod.current = e.nativeEvent.isComposing;
      if (e.code === "Enter") {
        e.preventDefault();
        // prevent send message when using input method enter
        if (!e.shiftKey && !isUseInputMethod.current) handleSend();
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "Enter" && !e.shiftKey) {
        setQuery(query.replace(/\n$/, ""));
        e.preventDefault();
      }
    };

    const sendIconThemeStyle = {
      color:
        query ||
        query.trim() !== "" ||
        (currentApp?.upload_prompt &&
          currentApp?.visionConfig?.enabled &&
          files.length > 0) ||
        (currentApp?.upload_prompt && !currentApp?.visionConfig?.enabled)
          ? "#155eef"
          : "#d1d5db",
    };

    const sendBtn = (
      <div
        className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
        onClick={handleSend}
      >
        <DeepIcon
          name="Send"
          alt="Send"
          className={`w-5 h-5 group-hover:text-primary-600`}
          style={sendIconThemeStyle}
        />
      </div>
    );

    const handleNewChat = () => {
      handleRestart();
      setQuery("");
      onChangeQuery && onChangeQuery("");
    };

    return (
      <>
        <div className="relative w-full">
          <div
            className={`relative p-[5.5px]  bg-[#f7f9fb] dark:bg-[#2f2f2f]  rounded-xl overflow-y-auto  ${"isDragActive" && "border-primary-600  mb-4"}`}
          >
            {/* {needNewChat && (
              <div
                className="absolute bottom-2 left-2 flex items-center"
                onClick={handleNewChat}
              >
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer
                      hover:bg-gray-100`}
                >
                  <Tooltip content={"new chat"} id={"new chat"} position="top">
                    <DeepIcon
                      name="NewChat"
                      className="text-black w-4 h-4"
                      title={"new chat"}
                    />
                  </Tooltip>
                </div>
                {!visionConfig?.enabled && (
                  <div className="mx-1 w-[1px] h-4 bg-black/5" />
                )}
              </div>
            )} */}
            {/* {visionConfig?.enabled && (
              <>
                <div className="absolute bottom-2 left-10 flex items-center">
                  <ChatImageUploader
                    settings={visionConfig}
                    onUpload={onUpload}
                    disabled={files.length >= visionConfig.number_limits}
                    currentAppToken={currentAppToken}
                  />
                  <div className="mx-1 w-[1px] h-4 bg-black/5" />
                </div>
                <div className="pl-20">
                  <ImageList
                    list={files}
                    onRemove={onRemove}
                    onReUpload={onReUpload}
                    onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                    onImageLinkLoadError={onImageLinkLoadError}
                  />
                </div>
              </>
            )} */}
            {/* <>
              <div className="absolute bottom-[7px] left-4 flex items-center h-8">
                <div className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer  dark:text-white">
                  <SearchIcon />
                </div>
                <div className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer dark:text-white">
                  <MessageIcon />
                </div>
                <div className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer dark:text-white">
                  <TargetIcon />
                </div>
                <div className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer dark:text-white">
                  <O1Icon />
                </div>
              </div>
            </> */}
            <Textarea
              className={`
              flex-1 block w-full px-2 pr-[118px] py-[7px] leading-5 text-sm text-gray-700 font-[auto] dark:text-white bg-[#F7F9FB] dark:bg-[#2f2f2f]
               max-h-[120px]  overflow-y-auto
            `} //pl-36
              // ${visionConfig?.enabled ? "pl-20" : "pl-12"}
              value={query}
              onChange={handleContentChange}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
              onPaste={onPaste}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              placeholder={!isResponding ? currentApp?.name || "" : ""}
              autoSize
              ref={inputRef}
            />
            {isResponding && (
              <div
                className={`absolute pl-1 top-0 bottom-0 flex items-center left-36`}
                // visionConfig?.enabled ? "left-20" : "left-12"
              >
                {/* <span className="mr-1 font-math">Thinking</span> */}
                <span className="dot ml-1 bg-red-500 rounded-full w-1 h-1 animate-bounce animation-delay-0"></span>
                <span className="dot ml-1 bg-yellow-500 rounded-full w-1 h-1 animate-bounce animation-delay-200"></span>
                <span className="dot ml-1 bg-blue-500 rounded-full w-1 h-1 animate-bounce animation-delay-400"></span>
              </div>
            )}
            <div className="absolute bottom-[7px] right-2 flex items-center h-8">
              <div className="flex items-center px-1 h-5 rounded-md bg-gray-100 text-xs font-medium text-gray-500">
                {query.trim().length}
              </div>
              {query ? (
                <div
                  className="flex justify-center items-center ml-2 w-8 h-8 cursor-pointer  hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-white  rounded-lg"
                  onClick={() => {
                    onChangeQuery && onChangeQuery("");
                    setQuery("");
                  }}
                >
                  <DeepIcon name="Circle" />
                </div>
              ) : null}
              <div className="mx-1 w-[1px] h-4 bg-black opacity-5" />
              {!isResponding ? sendBtn : StopButton && StopButton()}
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default memo(ChatInput);
