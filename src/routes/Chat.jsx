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

  //disabled by default, we only enable it when messagesTree is null
  const messagesQuery = useGetMessagesByConvoId(conversation?.id, {
    enabled: false,
  });

  const [conversationsList] = useRecoilState(store.conversationsList);
  const { switchToConversation } = store.useConversation();

  useEffect(() => {
    document.title =
      conversation?.name ||
      conversation?.title ||
      import.meta.env.VITE_APP_TITLE ||
      "Chat";
  }, [conversation?.id]);

  useEffect(() => {
    if (conversationsList) {
      // switchToConversation(
      //   conversationsList.find((item) => item.id === conversation?.id) ?? {}
      // );
    }
  }, [conversationsList]);

  useEffect(() => {
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

  return (
    <>
      <ChatList
        appChatListData={messagesQuery?.data?.data ?? []}
        currentConversationId={conversation?.id}
      />
      {/* <TextChat /> */}
    </>
  );
}
