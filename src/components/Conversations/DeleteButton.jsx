/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 15:30:07
 */
import { useEffect } from "react";
import TrashIcon from "../svg/TrashIcon";
import CrossIcon from "../svg/CrossIcon";
import { useRecoilValue } from "recoil";
import { useDeleteConversationMutation } from "~/data-provider";

import store from "~/store";

export default function DeleteButton({
  conversationId,
  renaming,
  cancelHandler,
  retainView,
}) {
  const currentConversation = useRecoilValue(store.conversation) || {};
  const { newConversation } = store.useConversation();
  const { refreshConversations } = store.useConversations();

  const deleteConvoMutation = useDeleteConversationMutation(conversationId);

  useEffect(() => {
    if (deleteConvoMutation.isSuccess) {
      if (currentConversation?.conversationId == conversationId)
        newConversation();

      refreshConversations();
      retainView();
    }
  }, [deleteConvoMutation.isSuccess]);

const clickHandler = (event) => {
  event.stopPropagation();
  deleteConvoMutation.mutate({ conversationId, source: "button" });
};

const handler = renaming ? (event) => { event.stopPropagation(); cancelHandler(); } : clickHandler;

  return (
    <button
      className="p-1 hover:text-gray-700 dark:hover:text-gray-200"
      onClick={handler}
    >
      {renaming ? <CrossIcon /> : <TrashIcon />}
    </button>
  );
}
