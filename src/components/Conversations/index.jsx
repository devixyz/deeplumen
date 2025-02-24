/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 15:30:07
 */
import React from "react";
import Conversation from "./Conversation";

export default function Conversations({
  conversations,
  moveToTop,
  isNotClick,
}) {
  return (
    <>
      {conversations &&
        conversations.length > 0 &&
        conversations.map((convo) => {
          return (
            <Conversation
              isNotClick={isNotClick}
              key={convo.conversationId}
              conversation={convo}
              retainView={moveToTop}
            />
          );
        })}
    </>
  );
}
