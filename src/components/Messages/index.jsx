import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilValue } from "recoil";
import Spinner from "../svg/Spinner";
import throttle from "lodash/throttle";
import { CSSTransition } from "react-transition-group";
import ScrollToBottom from "./ScrollToBottom";
import MultiMessage from "./MultiMessage";
import MessageHeader from "./MessageHeader";
import { useScreenshot } from "~/utils/screenshotContext.jsx";
import AiTools from "~/components/aiTools";

import store from "~/store";

export default function Messages({ appChatListData, currentConversationId }) {
  const [currentEditId, setCurrentEditId] = useState(-1);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollableRef = useRef(null);
  const messagesEndRef = useRef(null);

  const _messagesTree = useRecoilValue(store.messages) || {};

  console.log(_messagesTree, "_messagesTree");

  const conversation = useRecoilValue(store.conversation) || {};
  const { id: conversationId } = conversation;

  const { screenshotTargetRef } = useScreenshot();

  // const models = useRecoilValue(store.models) || [];
  // const modelName = models.find(element => element.model == model)?.name;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
      const diff = Math.abs(scrollHeight - scrollTop);
      const percent = Math.abs(clientHeight - diff) / clientHeight;
      const hasScrollbar = scrollHeight > clientHeight && percent > 0.2;
      setShowScrollButton(hasScrollbar);
    }, 650);

    // Add a listener on the window object
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToBottom = useCallback(
    throttle(
      () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollButton(false);
      },
      750,
      { leading: true }
    ),
    [messagesEndRef]
  );

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollableRef.current;
    const diff = Math.abs(scrollHeight - scrollTop);
    const percent = Math.abs(clientHeight - diff) / clientHeight;
    if (percent <= 0.2) {
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  let timeoutId = null;
  const debouncedHandleScroll = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleScroll, 100);
  };

  const scrollHandler = (e) => {
    e.preventDefault();
    scrollToBottom();
  };

  return (
    <div
      className="flex-1 overflow-y-auto pt-0"
      ref={scrollableRef}
      onScroll={debouncedHandleScroll}
    >
      <AiTools
        appChatListData={appChatListData}
        currentConversationId={currentConversationId}
      ></AiTools>
      {/* <div
        className="dark:gpt-dark-gray mb-32 h-auto md:mb-48"
        ref={screenshotTargetRef}
      >
        <AiTools></AiTools>
        <div className="dark:gpt-dark-gray flex h-auto flex-col items-center text-sm">
          
          <div
            className="dark:gpt-dark-gray group h-0 w-full flex-shrink-0 dark:border-gray-900/50"
            ref={messagesEndRef}
          />
        </div>
      </div> */}
    </div>
  );
}
