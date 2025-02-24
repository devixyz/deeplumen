import { useState, useRef, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useUpdateConversationMutation } from "~/data-provider";
import RenameButton from "./RenameButton";
import DeleteButton from "./DeleteButton";
import ConvoIcon from "../svg/ConvoIcon2";

import store from "~/store";

export default function Conversation({ conversation, retainView, isNotClick }) {
  const [currentConversation, setCurrentConversation] = useRecoilState(
    store.conversation
  );
  const setSubmission = useSetRecoilState(store.submission);

  const { refreshConversations } = store.useConversations();
  const { switchToConversation } = store.useConversation();

  const updateConvoMutation = useUpdateConversationMutation(
    currentConversation?.id
  );

  const [renaming, setRenaming] = useState(false);
  const inputRef = useRef(null);

  const { id: conversationId, name: title } = conversation;

  const [titleInput, setTitleInput] = useState(title);

  const clickHandler = async () => {
    if (isNotClick) return;
    if (currentConversation?.id === conversationId) {
      return;
    }

    // stop existing submission
    setSubmission(null);

    // set document title
    document.title = title;

    // set conversation to the new conversation
    switchToConversation(conversation);
  };

  const renameHandler = (e) => {
    e.preventDefault();
    setTitleInput(title);
    setRenaming(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 25);
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    setRenaming(false);
  };

  const onRename = (e) => {
    e.preventDefault();
    setRenaming(false);
    if (titleInput === title) {
      return;
    }
    updateConvoMutation.mutate({ conversationId, title: titleInput });
  };

  useEffect(() => {
    if (updateConvoMutation.isSuccess) {
      refreshConversations();
      if (conversationId == currentConversation?.id) {
        setCurrentConversation((prevState) => ({
          ...prevState,
          title: titleInput,
        }));
      }
    }
  }, [updateConvoMutation.isSuccess]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onRename(e);
    }
  };

  const aProps = {
    className:
      "hover:group py-1 dark:bg-white/5 group relative flex cursor-pointer items-center gap-3 break-all rounded-md  py-3 px-3 pr-14 text-black dark:text-white bg-gray-200 dark:bg-[#2A2B32]  hover:bg-gray-200 dark:hover:bg-gray-800 my-[2px]",
  };

  if (currentConversation?.id !== conversationId) {
    aProps.className =
      "hover:group bg-gray-50 py-1 dark:bg-white/5 text-black dark:text-white group relative flex cursor-pointer items-center gap-3 break-all rounded-md py-3 px-3 bg-gray-200 hover:bg-gray-200 dark:hover:bg-[#2A2B32] my-[2px]";
  }

  return (
    <a onClick={() => clickHandler()} {...aProps}>
      <ConvoIcon />
      <div
        className={`relative max-h-5 flex-1 overflow-hidden text-ellipsis break-all line-clamp-1 ${currentConversation?.id === conversationId && "pr-6"}`}
      >
        {renaming === true ? (
          <input
            ref={inputRef}
            type="text"
            className="m-0 mr-0 w-full border border-blue-500 bg-transparent p-0 text-sm leading-tight outline-none"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={onRename}
            onKeyDown={handleKeyDown}
          />
        ) : (
          title
        )}
      </div>
      {currentConversation?.id !== conversationId ? (
        <div className="visible absolute right-1 z-10 flex invisible  group-hover:visible">
          {/* <RenameButton
            conversationId={conversationId}
            renaming={renaming}
            renameHandler={renameHandler}
            onRename={onRename}
          /> */}
          <DeleteButton
            conversationId={conversationId}
            renaming={renaming}
            cancelHandler={cancelHandler}
            retainView={retainView}
            isNotClick={isNotClick}
          />
        </div>
      ) : (
        <div></div>
        // <div className="absolute inset-y-0 right-0 z-10 w-8 rounded-r-md bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]" />
      )}
    </a>
  );
}
