import React from "react";
import Conversations from "~/components/Conversations";
import Spinner from "~/components/svg/Spinner";
import NewChat from "../NewChat2.jsx";

const ChatSections = ({
  myChats,
  sharedChats,
  publishedChats,
  isLoading,
  isFetching,
  conversationId,
  moveToTop,
}) => {
  return (
    <div className="h-full">
      <Section
        title="My Chats"
        chats={myChats}
        isLoading={isLoading}
        isFetching={isFetching}
        conversationId={conversationId}
        moveToTop={moveToTop}
      />
      {/* <Section
        title="Shared Chats"
        chats={sharedChats}
        isLoading={isLoading}
        isFetching={isFetching}
        conversationId={conversationId}
        moveToTop={moveToTop}
        isNotClick={true}
      />
      <Section
        title="Published Chats"
        chats={publishedChats}
        isLoading={isLoading}
        isFetching={isFetching}
        conversationId={conversationId}
        moveToTop={moveToTop}
        isNotClick={true}
      /> */}
    </div>
  );
};

const Section = ({
  title,
  chats,
  conversationId,
  moveToTop,
  isLoading,
  isFetching,
  isNotClick,
}) => (
  <div
    className={`flex-1 flex flex-col justify-start mb-2 h-[25%] ${title == "My Chats" && "h-full"}`}
  >
    <h2 className="relative font-bold text-[1.2rem] p-2 pb-4 text-black dark:text-white text-center">
      {title}
      {title == "My Chats" && (
        <div className="absolute top-0 right-2">
          <NewChat></NewChat>
        </div>
      )}
    </h2>
    <div className="flex-1 overflow-y-auto">
      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        <Conversations
          conversations={chats}
          conversationId={conversationId}
          moveToTop={moveToTop}
          isNotClick={isNotClick}
        />
      )}
    </div>
  </div>
);

export default ChatSections;
