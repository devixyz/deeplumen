import React, { memo, useCallback, useEffect, useRef, useState } from "react";
// import { debounce } from 'lodash-es';
import Question from "./question";
import Answer from "./answer";
import ChatInput from "./chat-input";
import Button from "./button";
import { getChatApiUrl } from "./ssePost";
import ArIcon from "~/components/arIcon";
import Landing from "~/components/ui/Landing";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import store from "~/store";
const Chat = ({
  chatList,
  isResponding,
  noStopResponding,
  handleStop,
  chatContainerInnerClassName,
  chatFooterClassName,
  chatFooterInnerClassName,
  currentAppToken,
  chatNode,
  newConversationInputs,
  handleSend,
  currentApp,
  handleRestart,
  conversationId,
}) => {
  const chatContainerRef = useRef(null);
  const chatContainerInnerRef = useRef(null);
  const chatFooterRef = useRef(null);
  const userScrolledRef = useRef(false);
  const [newConversationId, setNewConversationId] = useState(conversationId);

  const [currentConversation, setCurrentConversation] = useRecoilState(
    store.conversation
  );

  const { refreshConversations } = store.useConversations();

  const handleNewConversationCompleted = useCallback((newConversationId) => {
    setCurrentConversation({
      id: newConversationId,
    });
    setNewConversationId(newConversationId);

    refreshConversations();
  }, []);

  useEffect(() => {
    setNewConversationId(conversationId);
  }, [conversationId]);

  const handleScrolltoBottom = useCallback(() => {
    if (chatContainerRef.current && !userScrolledRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    handleScrolltoBottom();
  }, [handleScrolltoBottom]);

  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        handleScrolltoBottom();
      });
    }
  });

  useEffect(() => {
    if (chatFooterRef.current && chatContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { blockSize } = entry.borderBoxSize[0];

          chatContainerRef.current.style.paddingBottom = `${blockSize + 10}px`;
          handleScrolltoBottom();
        }
      });

      resizeObserver.observe(chatFooterRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [handleScrolltoBottom]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const setUserScrolled = () => {
        if (chatContainer)
          userScrolledRef.current =
            chatContainer.scrollHeight - chatContainer.scrollTop >=
            chatContainer.clientHeight + 300;
      };
      chatContainer.addEventListener("scroll", setUserScrolled);
      return () => chatContainer.removeEventListener("scroll", setUserScrolled);
    }
  }, []);

  const [query, setQuery] = useState("");

  const onSend = useCallback(
    (message, files) => {
      const data = {
        query: message,
        inputs: newConversationInputs || {},
        conversation_id:
          newConversationId == "000-000" ? "" : newConversationId,
        response_mode: "streaming",
        user: "abc-123",
      };

      if (files?.length) data.files = files;

      handleSend(getChatApiUrl(), data, {
        onConversationComplete: newConversationId
          ? undefined
          : handleNewConversationCompleted,
        currentAppToken,
      });
    },
    [
      currentAppToken,
      newConversationId,
      newConversationInputs,
      handleNewConversationCompleted,
    ]
  );

  const StopButton = ({ isResponding, handleStop }) => {
    return (
      isResponding && (
        <div
          className="group flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200  dark:hover:bg-gray-800 cursor-pointer "
          onClick={handleStop}
        >
          <ArIcon
            name="Stop"
            className={`w-5 h-5 text-black dark:text-white group-hover:text-primary-600`}
          />
        </div>
      )
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      return true;
    }
  };

  const onHandleRestart = () => {
    handleRestart();
  };

  return (
    <div className="relative h-full w-full m-auto overflow-hidden ">
      <div
        ref={chatContainerRef}
        className={`relative h-full overflow-y-auto sm:p-8 ${conversationId === "" && "sm:pt-0"}`}
      >
        {!conversationId || conversationId === "" ? (
          <Landing />
        ) : (
          <React.Fragment>
            {chatNode}
            <div
              ref={chatContainerInnerRef}
              className={`${chatContainerInnerClassName} p-4`}
            >
              {chatList.map((item, index) => {
                if (item.isAnswer) {
                  const isLast = item.id === chatList[chatList.length - 1]?.id;
                  return (
                    <Answer
                      key={item.id}
                      item={item}
                      question={chatList[index - 1]?.content}
                      index={index}
                      responding={isLast && isResponding}
                      // answerIcon={answerIcon}
                      // allToolIcons={allToolIcons}
                      // showPromptLog={showPromptLog}
                      // chatAnswerContainerInner={chatAnswerContainerInner}
                      // hideProcessDetail={hideProcessDetail}
                    />
                  );
                }
                return <Question key={item.id} item={item} />;
              })}
            </div>
          </React.Fragment>
        )}
      </div>
      {/* <div className="group h-24 w-full flex-shrink-0 dark:border-gray-900/50 dark:bg-gray-900 md:h-32" /> */}
      <div
        className={`absolute bottom-0 pb-[10px] w-full bg-light-gradient dark:bg-dark-gradient ${
          !noStopResponding && chatFooterClassName
        }`}
        ref={chatFooterRef}
      >
        <div
          className={`${chatFooterInnerClassName} mx-auto w-full max-w-full px-8 mt-2 sm:px-16`}
        >
          {/* {!noStopResponding && isResponding && (
            <div className="flex justify-center mb-2">
              <Button onClick={handleStop}>
                <ArIcon
                  name="Stop"
                  className="mr-[5px] w-3.5 h-3.5 text-gray-500"
                />
                <span className="text-xs text-gray-500 font-normal">
                  {"Stop responding" || "appDebug.operation.stopResponding"}
                </span>
              </Button>
            </div>
          )} */}

          <ChatInput
            visionConfig={currentApp?.file_upload?.image}
            // speechToTextConfig={config?.speech_to_text}
            onSend={onSend}
            currentAppToken={currentAppToken}
            currentApp={currentApp}
            onKeyDown={handleKeyDown}
            onChangeQuery={setQuery}
            StopButton={() => StopButton({ isResponding, handleStop })}
            isResponding={isResponding}
            handleRestart={onHandleRestart}
            placeholder={"Type message"}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Chat);
