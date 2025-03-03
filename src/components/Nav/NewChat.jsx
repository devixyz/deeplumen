
import React from 'react';
import store from '~/store';

export default function NewChat() {
  const { newConversation } = store.useConversation();

  const clickHandler = () => {
    // dispatch(setInputValue(''));
    // dispatch(setQuery(''));
    newConversation();
  };

  return (
    <a
      onClick={clickHandler}
      className="mb-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border dark:border-white/20 px-3 py-3 text-sm dark:text-white transition-colors duration-200 hover:bg-gray-500/10"
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      New chat
    </a>
  );
}
