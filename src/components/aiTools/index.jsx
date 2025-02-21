/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-21 15:01:54
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilValue } from "recoil";

import throttle from "lodash/throttle";
import { useScreenshot } from "~/utils/screenshotContext.jsx";
import ChatMessages from "./ChatMessages";

import store from "~/store";

export default function ChatList({ appChatListData, currentConversationId }) {
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
      <ChatMessages
        appChatListData={appChatListData}
        currentConversationId={currentConversationId}
      ></ChatMessages>
    </div>
  );
}
