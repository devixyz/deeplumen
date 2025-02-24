/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 15:30:07
 */
import React, { useEffect, useState } from "react";
import TrashIcon from "../svg/TrashIcon";
import CrossIcon from "../svg/CrossIcon";
import { useRecoilValue } from "recoil";
import { useDeleteConversationMutation } from "~/data-provider";
import DeleteConversation from "./DeleteConversation";

import store from "~/store";

export default function DeleteButton({
  conversationId,
  renaming,
  cancelHandler,
  retainView,
  isNotClick,
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

  const clickHandler = () => {
    deleteConvoMutation.mutate({ conversationId, source: "button" });
  };

  const handler = renaming ? cancelHandler : clickHandler;

  const [open, setOpen] = useState(false);

  const onOpenChange = (open) => {
    setOpen(open);
  };

  return (
    <React.Fragment>
      <button
        className="p-1 hover:text-gray-700 dark:hover:text-gray-200"
        onClick={(event) => {
          event.stopPropagation();
          if (isNotClick) return;
          setOpen(true);
        }}
      >
        {renaming ? <CrossIcon /> : <TrashIcon />}
      </button>
      {open && (
        <DeleteConversation
          onSave={handler}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    </React.Fragment>
  );
}
