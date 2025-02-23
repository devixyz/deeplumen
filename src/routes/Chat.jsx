/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 15:30:07
 */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import store from "~/store";

import ChatList from "../components/aiTools";
import TextChat from "../components/Input";

import {
  useGetMessagesByConvoId,
  useGetConversationByIdMutation,
} from "~/data-provider";

export default function Chat() {
  const [conversation, setConversation] = useRecoilState(store.conversation);
  const setMessages = useSetRecoilState(store.messages);

  const { newConversation } = store.useConversation();
  const { conversationId } = useParams();
  const navigate = useNavigate();

  console.log(conversationId, "conversationId");

  //disabled by default, we only enable it when messagesTree is null
  const messagesQuery = useGetMessagesByConvoId(conversationId, {
    enabled: false,
  });
  const [conversationsList] = useRecoilState(
    store.conversationsList
  );
  const { switchToConversation } = store.useConversation();

  // when conversation changed or conversationId (in url) changed
  useEffect(() => {
    console.log(conversation, conversationId, "conversation22");

    if (conversation == null) {
      // no current conversation, we need to do something
      if (conversationId === "new") {
        // create new
        newConversation();
      } else if (conversationId) {
        // fetch it from server
      } else {
        navigate(`/chat/new`);
      }
    } else if (conversation?.id !== conversationId && !!conversation?.id) {
      // conversationId (in url) should always follow conversation?.conversationId, unless conversation is null
      navigate(`/chat/${conversation?.id}`);
    }
    document.title =
      conversation?.name ||
      conversation?.title ||
      import.meta.env.VITE_APP_TITLE ||
      "Chat";
  }, [conversation, conversationId]);
  
  useEffect(() => {
   if (conversationId!=="new"&&conversationsList) {
      switchToConversation(
          conversationsList.find((item) => item.id === conversationId) ?? []
      );
    }
  }, [conversationsList])

  useEffect(() => {
    if (conversationId == "new") return;
    if (conversation?.id) {
      messagesQuery.refetch(conversation?.id);
    }
  }, [conversation?.id, messagesQuery]);

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data.data);
    } else if (messagesQuery.isError) {
      console.error("failed to fetch the messages");
      console.error(messagesQuery.error);
      setMessages(null);
    }
  }, [messagesQuery.data, messagesQuery.isError, setMessages]);

  // if conversationId not match
  if (conversation?.id !== conversationId) return null;
  // if conversationId is null
  if (!conversationId) return null;

  return (
    <>
      <ChatList
        appChatListData={messagesQuery?.data?.data ?? []}
        currentConversationId={conversationId}
      />
      {/* <TextChat /> */}
    </>
  );
}
