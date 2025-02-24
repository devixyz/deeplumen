/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-21 10:54:09
 */
import React, { useMemo, useState, useEffect } from "react";
import Chat from "./chat";
import { useChat } from "./hook";
import { apiFetch } from "./apiFetch.js";

export async function stopChatApi(task_id, token, user = "abc-123") {
  const response = await apiFetch(
    `/api/v1/chat-messages/${task_id}/stop`,
    "POST",
    {
      user: user,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  console.log(response, "response");
  return response;
}

const ChatList = ({ appChatListData, currentConversationId }) => {
  const stopChat = async (taskId, currentAppToken) => {
    console.log(`Stop chat with taskId: ${taskId}`);
    await stopChatApi(taskId, currentAppToken);
  };

  const appPrevChatList = useMemo(() => {
    const data = appChatListData;

    const chatList = [];

    if (currentConversationId && data.length) {
      data.forEach((item) => {
        chatList.push({
          id: `question-${item.id}`,
          content: item.query,
          isAnswer: false,
          message_files:
            item.message_files?.filter((file) => file.belongs_to === "user") ||
            [],
        });
        chatList.push({
          id: item.id,
          content: item.answer,
          isAnswer: true,
          message_files:
            item.message_files?.filter(
              (file) => file.belongs_to === "assistant"
            ) || [],
        });
      });
    }
    return chatList;
  }, [appChatListData, currentConversationId]);

  useEffect(() => {
    console.log(appPrevChatList, "appPrevChatList");
  }, [appPrevChatList]);

  const {
    chatList,
    setChatList,
    conversationId,
    isResponding,
    setIsResponding,
    handleSend,
    handleRestart,
    handleStop,
    currentAppToken,
    currentApp,
  } = useChat(appPrevChatList, stopChat, currentConversationId);

  useEffect(() => {
    console.log(conversationId, chatList, "conversationId");
  }, [conversationId]);

  return (
    <div className="flex flex-col h-full">
      <Chat
        chatList={chatList}
        setChatList={setChatList}
        conversationId={conversationId}
        handleSend={handleSend}
        handleRestart={handleRestart}
        handleStop={handleStop}
        isResponding={isResponding}
        setIsResponding={setIsResponding}
        currentAppToken={currentAppToken}
        currentApp={currentApp}
      />
    </div>
  );
};

export default ChatList;
